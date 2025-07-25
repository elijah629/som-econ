/* raw data types */

import { cacheLife } from "next/dist/server/use-cache/cache-life";

export type RawLeaderboard = RawUser[];

export interface RawUser {
  slack_id: string;
  shells: number;
  payouts: RawPayout[];
}

// User - Admin modification
// ShopOrder - purchases
// ShipEvent - payouts
export type PayoutType = "User" | "ShopOrder" | "ShipEvent";

export interface RawPayout {
  type: PayoutType;
  id: string;
  amount: string;
  created_at: string;
}

/* parsed data types */

export type Leaderboard = User[];

export interface User {
  slackId: string;
  shells: number;
  payouts: Payout[];
}

export interface Payout {
  type: PayoutType;
  id: number;
  amount: number;
  createdAt: Date;
}

/* ranking */
export type RankedLeaderboard = RankedUser[];

export interface RankedUser {
  slackId: string;
  shells: number;
  rank: number;
  payouts: Payout[];
}

/* retreival functions */

const API_URL = "https://explorpheus.hackclub.com/leaderboard";

export async function fetchRawLeaderboard(): Promise<RawLeaderboard> {
  return (await fetch(API_URL, {
    cache: "force-cache",
    next: { revalidate: 3600 },
  }).then((raw) => raw.json())) as RawLeaderboard;
}

export function parseLeaderboard(raw: RawLeaderboard): Leaderboard {
  return raw
    .map((user) => ({
      slackId: user.slack_id,
      shells: user.shells,
      payouts: user.payouts.map((payout) => ({
        type: payout.type,
        id: Number(payout.id),
        amount: Number(payout.amount),
        createdAt: new Date(payout.created_at),
      })),
    }))
    .sort((a, b) => b.shells - a.shells);
}

export async function fetchLeaderboard(): Promise<Leaderboard> {
  const raw = await fetchRawLeaderboard();

  return parseLeaderboard(raw);
}

export function ranked(leaderboard: Leaderboard): RankedLeaderboard {
  const ranksMap = new Map();
  let rank = 1;

  for (const user of leaderboard) {
    if (!ranksMap.has(user.shells)) {
      ranksMap.set(user.shells, rank);
    }
    rank++;
  }

  return leaderboard.map((user) => ({
    ...user,
    rank: ranksMap.get(user.shells),
  }));
}
