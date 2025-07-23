import { LorenzMetrics } from "@/components/lorenz-metrics";
import type {
  LorenzMetrics as LM,
  PayoutMetrics,
  ShopMetrics,
} from "@/lib/metrics";
import { ShopLeaderboard } from "@/components/shop-leaderboard";
import { Currency } from "@/types/currency";
import { PayoutTypes } from "./payout-types";

export function UserMetrics({
  lorenz,
  gini,
  currency,
  shop,
  payout,
}: {
  lorenz: LM;
  gini: number;
  shop: ShopMetrics;
  currency: Currency;
  payout: PayoutMetrics;
}) {
  return (
    <>
      <h1 className="text-3xl font-bold my-8">User metrics</h1>

      <div className="flex w-full flex-col xl:flex-row gap-8">
        <div className="flex flex-col gap-8 grow">
          <LorenzMetrics lorenz={lorenz} gini={gini} />
          <PayoutTypes payout={payout} />
        </div>
        <ShopLeaderboard currency={currency} shop={shop} />
      </div>
    </>
  );
}
