import { MarketMetrics } from "@/components/market-metrics";
import { UserMetrics } from "@/components/user-metrics";
import { fetchLeaderboard } from "@/lib/leaderboard";
import { calculateMetrics } from "@/lib/metrics";
import { Currency } from "@/types/currency";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return [
    { currency: "USD" },
    { currency: "shells" },
  ];
}

export default async function Statistics({
  params,
}: {
  params: Promise<{ currency: "USD" | "shells" }>,
}) {
  const currency = (await params).currency;

  const leaderboard = await fetchLeaderboard();

  const { net, transaction, lorenz, gini, shop, payout } =
    calculateMetrics(leaderboard);

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
        leaderboard={leaderboard}
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
