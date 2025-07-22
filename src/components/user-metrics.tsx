import { LorenzMetrics } from "@/components/lorenz-metrics";
import type { LorenzMetrics as LM } from "@/lib/metrics";

export function UserMetrics({ lorenz, gini }: { lorenz: LM; gini: number }) {
  return (
    <>
      <h1 className="text-3xl font-bold my-8">User metrics</h1>
      <LorenzMetrics lorenz={lorenz} gini={gini} />
    </>
  );
}
