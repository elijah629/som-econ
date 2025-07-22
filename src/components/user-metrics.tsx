import { LorenzMetrics } from "@/components/lorenz-metrics";
import type { LorenzMetrics as LM, ShopMetrics } from "@/lib/metrics";
import { ShopLeaderboard } from "./shop-leaderboard";

export function UserMetrics({ lorenz, gini, shop }: { lorenz: LM; gini: number, shop: ShopMetrics }) {
  return (
    <>
      <h1 className="text-3xl font-bold my-8">User metrics</h1>

      <div className="flex w-full flex-col xl:flex-row gap-8">
        <LorenzMetrics lorenz={lorenz} gini={gini} />
        <ShopLeaderboard shop={shop}/>
      </div>
    </>
  );
}
