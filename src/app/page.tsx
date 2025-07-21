import { CountMetrics } from "@/components/count-metrics";
import { fetchLeaderboard } from "@/lib/explorpheus";
import { calculateMetrics } from "@/lib/metrics";

export default async function Statistics() {
  const leaderboard = await fetchLeaderboard();
  const { net, transaction } = calculateMetrics(leaderboard);

  return <main>
    <h1>Summer of Making economic measurements</h1>
    <CountMetrics net={net} transaction={transaction}/>
  </main>
}
