import { fetchLeaderboard } from "@/lib/explorpheus";
import { calculateMetrics } from "@/lib/metrics";
import { NextResponse } from "next/server";

export async function GET() {
  const leaderboard = await fetchLeaderboard();

  const metrics =
    calculateMetrics(leaderboard);

  return NextResponse.json(metrics);
}
