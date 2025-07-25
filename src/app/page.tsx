import { MarketMetrics } from "@/components/market-metrics";
import { UserMetrics } from "@/components/user-metrics";
import { fetchLeaderboard, ranked } from "@/lib/explorpheus";
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

  const { net, transaction, lorenz, gini, shop, payout } =
    calculateMetrics(leaderboard);

  const r = ranked(leaderboard);

  return (
    <main>
      <h1 className="text-3xl font-bold mb-3 text-center">
        Summer of Making economic measurements
      </h1>
      <h3 className="text-center mb-8">
        Based off of the latest data from the explorpheus API, refreshes every
        hour
      </h3>
      <MarketMetrics
        currency={currency as Currency}
        leaderboard={r}
        net={net}
        transaction={transaction}
      />
      <UserMetrics
        payout={payout}
        currency={currency as Currency}
        shop={shop}
        lorenz={lorenz}
        gini={gini}
      />
    </main>
  );
}
