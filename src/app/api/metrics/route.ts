import { calculateMetrics } from "@/lib/metrics";
import { fetchLeaderboard } from "@/lib/parth";
import { NextResponse } from "next/server";

export async function GET() {
  const leaderboard = await fetchLeaderboard();

  const metrics = calculateMetrics(leaderboard);

  return NextResponse.json(metrics);
}
