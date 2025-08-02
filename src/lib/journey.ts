import { Transaction } from "./parth";

export function isJourney(transactions: Transaction[]) {
  return (
    transactions.length > 0 &&
    transactions[0].type !== "ShopOrder" &&
    // user.transactions[0].shellDiff >= 0.05 * user.shells &&
    new Date(transactions[0].recorded_at) <= new Date("July 9, 2025")
  );
}
