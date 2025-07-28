import { MonetaryValue } from "@/components/monetary-value";
import { ShopLeaderboard } from "@/components/shop-leaderboard";
import { Badge } from "@/components/ui/badge";
import { UserTransactions } from "@/components/user-transactions";
import { isJourney } from "@/lib/journey";
import { shopMetricsFromTransactions } from "@/lib/metrics";
import { fetchLeaderboard } from "@/lib/parth";
import Image from "next/image";
import Link from "next/link";

export async function generateStaticParams() {
  return (await fetchLeaderboard()).entries.map((x) => ({
    user: x.slack_id,
  }));
}

export const dynamic = "force-static";
export const dynamicParams = false;

export default async function User({
  params,
}: {
  params: Promise<{ user: string }>;
}) {
  const slackId = (await params).user;
  const leaderboard = await fetchLeaderboard();

  // PERF: Could just use parth's user api, but it may not be in sync with the same cache.
  const user = leaderboard.entries.find(
    (user) => user.slack_id === slackId,
  )!;

  const totalShells = leaderboard.entries.reduce((a, b) => a + b.shells, 0);

  const {
    username,
    pfp_url,
    rank,
    shells,
    transactions
  } = user;

  const shopMetrics = shopMetricsFromTransactions(transactions);

  return (
    <main className="flex flex-col gap-8 w-full">
      <div className="bg-card text-card-foreground flex flex-col md:flex-row items-center justify-between gap-6 rounded-xl border p-6 shadow-sm">
        <div className="flex items-center gap-4 font-bold">
          <Image
            unoptimized
            className="rounded-xl"
            src={pfp_url}
            width={72}
            height={72}
            alt={username}
          />
          <div className="flex flex-col gap-2">
            <span className="flex gap-2">
              {username}
              {isJourney(user) && (
                  <Badge>Balance likely from Journey</Badge>
                )}
            </span>
            <span className="flex gap-2 items-center">
              <MonetaryValue value={shells} currency="shells" show="shells" /> ≈{" "}
              <MonetaryValue value={shells} currency="shells" show="usd" />
            </span>
          </div>
        </div>

        <div>Market control: {((shells * 100) / totalShells).toFixed(2)}%</div>
        <Link href={`/leaderboard/${Math.floor(rank / 10)}`}>
          Show on LB (#{rank})
        </Link>
      </div>
      <div className="flex gap-8 w-full xl:flex-row flex-col">
        <UserTransactions transactions={transactions} />
        <ShopLeaderboard currency="both" shop={shopMetrics} />
      </div>
    </main>
  );
}
