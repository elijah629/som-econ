import { LeaderboardEntry } from "./parth";

export function isJourney(user: LeaderboardEntry) {
  return user.transactions.length > 0 &&
                user.transactions[0].type !== "ShopOrder" &&
                // user.transactions[0].shellDiff >= 0.05 * user.shells &&
                new Date(user.transactions[0].recorded_at) <= new Date("July 9, 2025");
}
