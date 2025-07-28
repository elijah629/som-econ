import { CountMetrics } from "@/components/count-metrics";
import { UserLeaderboard } from "@/components/user-leaderboard";
import { IoMetrics } from "@/lib/metrics";
import { CurrencyPicker } from "./currency-picker";
import { ShellUSDChart } from "./shell-usd";
import { Currency } from "@/types/currency";
import { Leaderboard } from "@/lib/parth";

export function MarketMetrics({
  currency,
  leaderboard,
  transaction,
  net,
}: {
  currency: Currency;
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
      <div className="flex w-full flex-col xl:flex-row gap-8 mb-8">
        <UserLeaderboard
          currency={currency}
          total={net.at(-1)!.cumulativeTotal}
          leaderboard={leaderboard}
        />
        <CountMetrics currency={currency} net={net} transaction={transaction} />
      </div>
      <ShellUSDChart />
    </>
  );
}
