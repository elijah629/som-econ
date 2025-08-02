import { MonetaryValue } from "@/components/monetary-value";
import { ProjectList } from "@/components/project-list";
import { ShopLeaderboard } from "@/components/shop-leaderboard";
import { Badge } from "@/components/ui/badge";
import { UserTransactions } from "@/components/user-transactions";
import { isJourney } from "@/lib/journey";
import { shopMetricsFromTransactions } from "@/lib/metrics";
import { fetchLeaderboard, fetchUser, zipProjects } from "@/lib/parth";
import { upperQuartileMean } from "@/lib/upper-quartile-mean";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return (await fetchLeaderboard()).entries.map((x) => ({
    user: x.slack_id,
  }));
}

export const revalidate = 300;
export const dynamicParams = false;

export default async function User({
  params,
}: {
  params: Promise<{ user: string }>;
}) {
  const slackId = (await params).user;
  const user = await fetchUser(slackId);

  if (!user) {
    notFound();
  }

  const {
    image_72,
    current_shells: shells,
    rank,
    username,
    transactions,
    projects,
    devlogs,
  } = user;

  const shopMetrics = shopMetricsFromTransactions(transactions);
  const zippedProjects =
    projects && devlogs ? zipProjects(projects, devlogs) : [];
  const userAIChance =
    zippedProjects.length === 0
      ? 0
      : upperQuartileMean(
          zippedProjects.map((x) => x.ai_chance).sort((a, b) => a - b),
        );

  return (
    <main className="flex flex-col gap-8 w-full">
      <div className="bg-card text-card-foreground flex flex-col md:flex-row items-center justify-between gap-6 rounded-xl border p-6 shadow-sm">
        <div className="flex items-center gap-4 font-bold">
          <Image
            unoptimized
            className="rounded-xl"
            src={
              image_72 ||
              "https://ca.slack-edge.com/T0266FRGM-U015ZPLDZKQ-gf3696467c28-72"
            }
            width={72}
            height={72}
            alt={username || "Unknown user"}
          />
          <div className="flex flex-col gap-2">
            <span className="flex gap-2">
              {username || "<unknown>"}
              {isJourney(transactions) && (
                <Badge>Balance likely from Journey</Badge>
              )}
            </span>
            <span className="flex gap-2 items-center">
              <MonetaryValue value={shells} currency="shells" show="shells" /> ≈{" "}
              <MonetaryValue value={shells} currency="shells" show="usd" />
            </span>
          </div>
        </div>

        <span>{userAIChance.toFixed(2)}% chance this user is AI</span>

        <Link href={`/leaderboard/${Math.floor(rank / 10)}`}>
          Show on LB (#{rank})
        </Link>
      </div>
      <div className="flex gap-8 w-full xl:flex-row flex-col">
        <UserTransactions transactions={transactions} />
        <ShopLeaderboard currency="both" shop={shopMetrics} />
      </div>
      {projects && <ProjectList projects={zippedProjects} />}
    </main>
  );
}
