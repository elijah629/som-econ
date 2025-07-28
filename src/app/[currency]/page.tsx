import { MarketMetrics } from "@/components/market-metrics";
import { UserMetrics } from "@/components/user-metrics";
import { calculateMetrics } from "@/lib/metrics";
import { fetchLeaderboard } from "@/lib/parth";
import { Currency } from "@/types/currency";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return [
    { currency: "usd" },
    { currency: "shells" }
  ]
}

export default async function Statistics({ params }: { params: Promise<{ currency: Currency }> }) {
  const currency = (await params).currency as Currency;

  const leaderboard = await fetchLeaderboard();

  const { net, transaction, lorenz, gini, shop, transactionTypes } =
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
        currency={currency}
        leaderboard={leaderboard}
        net={net}
        transaction={transaction}
      />
      <UserMetrics
        transactionTypes={transactionTypes}
        currency={currency}
        shop={shop}
        lorenz={lorenz}
        gini={gini}
      />
    </main>
  );
}
