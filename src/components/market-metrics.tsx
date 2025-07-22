import { Leaderboard } from "@/lib/explorpheus";
import { CountMetrics } from "@/components/count-metrics";
import { UserLeaderboard } from "@/components/user-leaderboard";
import { IoMetrics } from "@/lib/metrics";
import { CurrencyPicker } from "./currency-picker";

export function MarketMetrics({
  currency,
  leaderboard,
  transaction,
  net,
}: {
  currency: "USD" | "shells";
  leaderboard: Leaderboard;
  net: IoMetrics;
  transaction: IoMetrics;
}) {
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold my-8">Market stats</h1>
        <CurrencyPicker value={currency} />
      </div>
      <div className="flex w-full flex-col lg:flex-row gap-8">
        <UserLeaderboard currency={currency} total={net.at(-1)!.cumulativeTotal} leaderboard={leaderboard} />
        <CountMetrics currency={currency} net={net} transaction={transaction} />
      </div>
    </>
  );
}
