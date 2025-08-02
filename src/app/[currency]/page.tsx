import { MarketMetrics } from "@/components/market-metrics";
import { UserMetrics } from "@/components/user-metrics";
import { calculateMetrics } from "@/lib/metrics";
import { fetchLeaderboard } from "@/lib/parth";
import { Currency } from "@/types/currency";

export const dynamicParams = false;
export const revalidate = 300;

export async function generateStaticParams() {
  return [{ currency: "usd" }, { currency: "shells" }];
}

export default async function Statistics({
  params,
}: {
  params: Promise<{ currency: Currency }>;
}) {
  const currency = (await params).currency as Currency;

  const leaderboard = await fetchLeaderboard();

  const { net, transaction, lorenz, gini, shop, transactionTypes } =
    calculateMetrics(leaderboard);

  return (
    <main>

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
