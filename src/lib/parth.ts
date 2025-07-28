export interface Leaderboard {
  entries: LeaderboardEntry[],
  page: number,
  per_page: number,
  total_count: number,
}

export interface LeaderboardEntry {
  slack_id: string,
  username?: string,
  shells: number,
  rank: number,
  pfp_url?: string,
  transactions: Transaction[],
}

// User - Admin modification
// ShopOrder - purchases
// ShipEvent - payouts
export type TransactionType = "User" | "ShopOrder" | "ShipEvent";

export interface Transaction {
  id: number,
  type: TransactionType,
  recorded_at: string,
  shellsBefore: number, // before
  shellDiff: number,    // + / -
  shellsAfter: number,  // after
}

// General snapshot of the SoM economy. I only use this API.
// I could use other APIs for users etc to save some bandwidth, but everything is always in sync
// with eachother if i always use this endpoint.
export async function fetchLeaderboard(): Promise<Leaderboard> {
  const lb = await fetch('https://exploresummer.livingfor.me/v1/leaderboard?pullAll=true&historicalData=true', {
    cache: "force-cache",
    next: { revalidate: 5 * 60 },
  });

  return await lb.json();
}
