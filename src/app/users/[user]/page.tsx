import { MonetaryValue } from "@/components/monetary-value";
import { ShopLeaderboard } from "@/components/shop-leaderboard";
import { Badge } from "@/components/ui/badge";
import { UserPayouts } from "@/components/user-payouts";
import { fetchLeaderboard } from "@/lib/leaderboard";
import { shopMetricsFromPayouts } from "@/lib/metrics";
import Image from "next/image";
import Link from "next/link";

export async function generateStaticParams() {
  return (await fetchLeaderboard()).users.map((x) => ({ user: x.explorpheus.slackId }));
}

export default async function User({
  params,
}: {
  params: Promise<{ user: string }>;
}) {
  const slackId = (await params).user;

  const { users: leaderboard, totalShells } = await fetchLeaderboard();

  const user = leaderboard.find((user) => user.explorpheus.slackId === slackId)!;
  const shopMetrics = shopMetricsFromPayouts(user.explorpheus.payouts);

  const {
    slack: { display_name, image_72, real_name },
    explorpheus: { payouts, shells, rank }
  } = user;

  return (
    <main className="flex flex-col gap-8 w-full">
      <div className="bg-card text-card-foreground flex flex-col md:flex-row items-center justify-between gap-6 rounded-xl border p-6 shadow-sm">
        <div className="flex items-center gap-4 font-bold">
          <Image
            unoptimized
            className="rounded-xl"
            src={image_72}
            width={72}
            height={72}
            alt={display_name || real_name}
          />
          <div className="flex flex-col gap-2">
          <span className="flex gap-2">
            {display_name || real_name}
            {payouts[0] &&
              payouts[0].type !== "ShopOrder" &&
              payouts[0].amount >= 0.1 * shells &&
              payouts[0].createdAt <= new Date("July 9, 2025") && (
                <Badge>Balance likely from Journey</Badge>
              )}
          </span>
                 <span className="flex gap-2 items-center">
          <MonetaryValue
            value={shells}
            currency="shells"
            show="shells"
          />{" "}
          ≈ <MonetaryValue value={shells} currency="shells" show="USD" />
        </span>
          </div>
        </div>


        <div>Market control: {((shells * 100) / totalShells).toFixed(2)}%</div>
        <Link href={`/leaderboard/${Math.floor(rank / 10)}`}>Show on LB (#{rank})</Link>
      </div>
      <div className="flex gap-8 w-full xl:flex-row flex-col">
        <UserPayouts payouts={payouts} />
        <ShopLeaderboard currency="both" shop={shopMetrics} />
      </div>
    </main>
  );
}
