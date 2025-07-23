import { Leaderboard, Payout, PayoutType } from "@/lib/explorpheus";
import { findClosestItems } from "@/lib/shop";

export interface Metrics {
  net: IoMetrics;
  transaction: IoMetrics;

  lorenz: LorenzMetrics;
  gini: number;

  shop: ShopMetrics;

  payout: PayoutMetrics;
}

export type ShopMetrics = {
  name: string;
  purchases: number;
  value: number;
}[];

export type PayoutMetrics = { type: PayoutType; count: number }[];

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
  const { net, transaction, shop, payout } = calculateCounts(leaderboard, 1); // good since SoM is small
  const lorenz = calculateLorenz(leaderboard, net.at(-1)!.cumulativeTotal);
  const gini = calculateGini(lorenz);

  return { net, transaction, lorenz, gini, shop, payout };
}

// Note: data must be sorted by balance high to low for this to work
function calculateLorenz(
  leaderboard: Leaderboard,
  totalShells: number,
): LorenzMetrics {
  const lorenzMetrics = [];
  let cumulativeShells = 0;

  for (let i = 0; i < leaderboard.length; i++) {
    const user = leaderboard[leaderboard.length - i - 1].shells;
    cumulativeShells += user;

    const population = ((i + 1) / leaderboard.length) * 100;
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
  shop: ShopMetrics;
  payout: PayoutMetrics;
} {
  const purchases = new Map<string, [number, number]>();

  const payoutTypes = new Map<PayoutType, number>();
  const netMap = new Map<number, { in: number; out: number; date: Date }>();
  const txMap = new Map<number, { in: number; out: number; date: Date }>();

  for (const entry of leaderboard) {
    for (const payout of entry.payouts) {
      const date = payout.createdAt;
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

      payoutTypes.set(payout.type, (payoutTypes.get(payout.type) ?? 0) + 1);

      if (payout.amount > 0) {
        netEntry.in += payout.amount;
        txEntry.in += 1;
      } else {
        netEntry.out -= payout.amount;
        txEntry.out += 1;

        appendShopMetricDeltasFromPayout(payout, purchases);
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
    payout: Array.from(payoutTypes, ([type, count]) => ({ type, count })),
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

export function shopMetricsFromPayouts(payouts: Payout[]): ShopMetrics {
  const purchases = new Map<string, [number, number]>();

  for (const payout of payouts) {
    appendShopMetricDeltasFromPayout(payout, purchases);
  }

  return buildShopMetricsFromPurchaseMap(purchases);
}

function appendShopMetricDeltasFromPayout(
  payout: Payout,
  purchases: Map<string, [number, number]>,
) {
  if (payout.type === "ShopOrder") {
    const closest = findClosestItems(-payout.amount);

    for (let i = 0; i < closest.length; i++) {
      const item = closest[i];
      const increment = 1 / (i + 1);
      const previous = purchases.get(item) ?? [0, 0];

      purchases.set(item, [previous[0] + increment, -payout.amount]);
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
