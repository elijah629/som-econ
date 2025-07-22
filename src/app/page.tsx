import { MarketMetrics } from "@/components/market-metrics";
import { UserMetrics } from "@/components/user-metrics";
import { fetchLeaderboard } from "@/lib/explorpheus";
import { calculateMetrics } from "@/lib/metrics";
import { Currency } from "@/types/currency";

export default async function Statistics({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const leaderboard = await fetchLeaderboard();
  let currency = (await searchParams).currency;

  if (currency !== "USD" && currency !== "shells") {
    currency = "shells";
  }

  const { net, transaction, lorenz, gini, shop } = calculateMetrics(leaderboard);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-3 text-center">
        Summer of Making economic measurements
      </h1>
      <h3 className="text-center mb-8">
        Based off of the latest data from the explorpheus API, refreshes every
        hour
      </h3>
      <MarketMetrics
        currency={currency as Currency}
        leaderboard={leaderboard}
        net={net}
        transaction={transaction}
      />
      <UserMetrics shop={shop} lorenz={lorenz} gini={gini} />
    </main>
  );
}
