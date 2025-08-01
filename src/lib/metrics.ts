import { findClosestItems } from "@/lib/shop";
import { Leaderboard, TransactionType, Transaction } from "@/lib/parth";

export interface Metrics {
  net: IoMetrics;
  transaction: IoMetrics;

  lorenz: LorenzMetrics;
  gini: number;

  shop: ShopMetrics;

  transactionTypes: TransactionTypeMetrics
}

export type ShopMetrics = {
  name: string;
  purchases: number;
  value: number;
}[];

export type TransactionTypeMetrics = { type: TransactionType, count: number }[];

export type LorenzMetrics = {
  population: number;
  wealth: number;
}[];

export type IoMetrics = {
  in: number;
  out: number;

  total: number; // in - out
  cumulativeTotal: number;

  date: Date;
}[];

export function normalizeZero(io: IoMetrics): IoMetrics {
  return io.map((d) => {
    if (d.total === 0) {
      return {
        ...d,
        in: 0.00001,
        out: 0.00001,
      };
    }
    return d;
  });
}

export function calculateMetrics(leaderboard: Leaderboard): Metrics {
  const { net, transaction, shop, transactionTypes } = calculateCounts(leaderboard, 1); // good since SoM is small
  const lorenz = calculateLorenz(leaderboard, net.at(-1)!.cumulativeTotal);
  const gini = calculateGini(lorenz);

  return { net, transaction, lorenz, gini, shop, transactionTypes };
}

// Note: data must be sorted by balance high to low for this to work
function calculateLorenz(
  leaderboard: Leaderboard,
  totalShells: number,
): LorenzMetrics {
  const lorenzMetrics = [];
  let cumulativeShells = 0;

  for (let i = 0; i < leaderboard.entries.length; i++) {
    const user =
      leaderboard.entries[leaderboard.entries.length - i - 1].shells;
    cumulativeShells += user;

    const population = ((i + 1) / leaderboard.entries.length) * 100;
    const wealth = (cumulativeShells / totalShells) * 100;

    lorenzMetrics.push({
      population,
      wealth,
    });
  }

  return lorenzMetrics;
}

function calculateCounts(
  leaderboard: Leaderboard,
  rangeInDays: number,
): {
  net: IoMetrics;
  transaction: IoMetrics;
  transactionTypes: TransactionTypeMetrics;
  shop: ShopMetrics;
} {
  const purchases = new Map<string, [number, number]>();

  const transactionTypes = new Map<TransactionType, number>();
  const netMap = new Map<number, { in: number; out: number; date: Date }>();
  const txMap = new Map<number, { in: number; out: number; date: Date }>();

  for (const entry of leaderboard.entries) {
    for (const transaction of entry.transactions) {
      const date = new Date(transaction.recorded_at);
      const bucketStart = getBucketStart(date, rangeInDays);
      const bucketKey = bucketStart.getTime();

      const netEntry = netMap.get(bucketKey) ?? {
        in: 0,
        out: 0,
        date: bucketStart,
      };
      const txEntry = txMap.get(bucketKey) ?? {
        in: 0,
        out: 0,
        date: bucketStart,
      };

      transactionTypes.set(transaction.type, (transactionTypes.get(transaction.type) ?? 0) + 1);

      if (transaction.shellDiff > 0) {
        netEntry.in += transaction.shellDiff;
        txEntry.in += 1;
      } else {
        netEntry.out -= transaction.shellDiff;
        txEntry.out += 1;

        appendShopMetricDeltasFromTransaction(transaction, purchases);
      }

      netMap.set(bucketKey, netEntry);
      txMap.set(bucketKey, txEntry);
    }
  }

  const buildWithCumulativeTotal = <T extends { date: Date; total: number }>(
    items: T[],
  ): (T & { cumulativeTotal: number })[] => {
    return items
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(
        ((cumulative) => (item) => {
          cumulative += item.total;
          return { ...item, cumulativeTotal: cumulative };
        })(0),
      );
  };

  const net = buildWithCumulativeTotal(
    Array.from(netMap.values()).map((entry) => ({
      ...entry,
      total: entry.in - entry.out,
    })),
  );

  const transaction = buildWithCumulativeTotal(
    Array.from(txMap.values()).map((entry) => ({
      ...entry,
      total: entry.in + entry.out,
    })),
  );

  return {
    net,
    transaction,
    shop: buildShopMetricsFromPurchaseMap(purchases),
    transactionTypes: Array.from(transactionTypes, ([type, count]) => ({ type, count })),
  };
}

function buildShopMetricsFromPurchaseMap(
  purchases: Map<string, [number, number]>,
) {
  return Array.from(purchases, ([name, [purchases, value]]) => ({
    name,
    purchases,
    value,
  })).sort((a, b) => b.purchases - a.purchases);
}

export function shopMetricsFromTransactions(transactions: Transaction[]): ShopMetrics {
  const purchases = new Map<string, [number, number]>();

  for (const transaction of transactions) {
    appendShopMetricDeltasFromTransaction(transaction, purchases);
  }

  return buildShopMetricsFromPurchaseMap(purchases);
}

function appendShopMetricDeltasFromTransaction(
  transaction: Transaction,
  purchases: Map<string, [number, number]>,
) {
  if (transaction.type === "ShopOrder") {
    const closest = PRICE_MAP.get(-transaction.shellDiff);

    if (closest) {
      const name = closest.join(" / ");
      const previous = purchases.get(name) ?? [0, 0];
      purchases.set(name, [previous[0] + 1, -transaction.shellDiff]);
    }
  }
}

function calculateGini(lorenzData: LorenzMetrics): number {
  let areaUnderCurve = 0;

  for (let i = 1; i < lorenzData.length; i++) {
    const x1 = lorenzData[i - 1].population / 100;
    const x2 = lorenzData[i].population / 100;
    const y1 = lorenzData[i - 1].wealth / 100;
    const y2 = lorenzData[i].wealth / 100;

    const trapezoidArea = ((x2 - x1) * (y1 + y2)) / 2;
    areaUnderCurve += trapezoidArea;
  }

  return 1 - 2 * areaUnderCurve;
}

function getBucketStart(date: Date, rangeInDays: number): Date {
  const time = date.getTime();
  const bucketTime =
    Math.floor(time / (rangeInDays * 86400000)) * (rangeInDays * 86400000);
  return new Date(bucketTime);
}
