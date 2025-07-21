import { Leaderboard } from "./explorpheus";

export interface Metrics {
  net: IoMetrics,
  transaction: IoMetrics
}

export type IoMetrics = {
  in: number,
  out: number,

  total: number, // in - out

  date: Date
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
  const { net, transaction } = calculateCounts(leaderboard, 1); // good since SoM is small

  return { net, transaction };
}

function calculateCounts(
  leaderboard: Leaderboard,
  rangeInDays: number
): { net: IoMetrics; transaction: IoMetrics } {
  const netMap = new Map<string, { in: number; out: number; date: Date }>();
  const txMap = new Map<string, { in: number; out: number; date: Date }>();

  for (const entry of leaderboard) {
    for (const payout of entry.payouts) {
      const date = payout.createdAt;
      const bucketStart = getBucketStart(date, rangeInDays);
      const bucketKey = bucketStart.toISOString();

      // Net aggregation
      const netEntry = netMap.get(bucketKey) ?? { in: 0, out: 0, date: bucketStart };
      const txEntry = txMap.get(bucketKey) ?? {
        in: 0,
        out: 0,
        date: bucketStart,
      };

      if (payout.amount > 0) {
        netEntry.in += payout.amount;
        txEntry.in += 1;
      } else {
        netEntry.out -= payout.amount;
        txEntry.out += 1;
      }

      netMap.set(bucketKey, netEntry);
      txMap.set(bucketKey, txEntry);
    }
  }

  const net: IoMetrics = Array.from(netMap.values()).map((entry) => ({
    ...entry,
    total: entry.in - entry.out,
  }));

  console.log(net);

  const transaction: IoMetrics = Array.from(txMap.values()).map(
    (entry) => ({
      ...entry,
      total: entry.in + entry.out,
    })
  );

  net.sort((a, b) => a.date.getTime() - b.date.getTime());
  transaction.sort((a, b) => a.date.getTime() - b.date.getTime());

  return { net, transaction };
}

function getBucketStart(date: Date, rangeInDays: number): Date {
  const time = date.getTime();
  const bucketTime = Math.floor(time / (rangeInDays * 86400000)) * (rangeInDays * 86400000);
  return new Date(bucketTime);
}
