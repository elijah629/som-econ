import { MonetaryValue } from "@/components/monetary-value";
import { ShopLeaderboard } from "@/components/shop-leaderboard";
import { Badge } from "@/components/ui/badge";
import { UserPayouts } from "@/components/user-payouts";
import { fetchLeaderboard } from "@/lib/explorpheus";
import { shopMetricsFromPayouts } from "@/lib/metrics";
import { fetchUser } from "@/lib/slack";
import Image from "next/image";

export const dynamicParams = false;
export const dynamic = 'force-static';

export async function generateStaticParams() {
  return (await fetchLeaderboard()).map(x => ({ user: x.slackId }));
}

export default async function User({ params }: { params: Promise<{ user: string }> }) {
  const slackId = (await params).user;
const leaderboard = await fetchLeaderboard();
  const total = leaderboard.reduce((a, b) => a + b.shells, 0);
  const lbUser = leaderboard.find((user) => user.slackId === slackId)!;
  const shopMetrics = shopMetricsFromPayouts(lbUser.payouts);
  const { profile: { display_name, image_72, real_name } } = await fetchUser(slackId);

  return <main className="flex flex-col gap-8 w-full">
    <div className="bg-card text-card-foreground flex flex-col sm:flex-row items-center justify-between gap-6 rounded-xl border p-6 shadow-sm">
      <div className="flex items-center gap-2 font-bold">
        <Image className="rounded-xl" src={image_72} width={72} height={72} alt={display_name || real_name}/>
        {display_name || real_name}
        { lbUser.payouts[0] && lbUser.payouts[0].type !== "ShopOrder" && lbUser.payouts[0].amount >= 0.1 * lbUser.shells && lbUser.payouts[0].createdAt <= new Date("July 9, 2025") && <Badge>Balance likely from Journey</Badge>}
      </div>

        <span className="flex gap-2 items-center">
<MonetaryValue value={lbUser.shells} currency="shells" show="shells" /> ≈ <MonetaryValue value={lbUser.shells} currency="shells" show="USD" />
        </span>
        <div>
          Market control: {(lbUser.shells * 100 / total).toFixed(2)}%
        </div>
    </div>
    <div className="flex gap-8 w-full xl:flex-row flex-col">
      <UserPayouts payouts={lbUser.payouts}/>
      <ShopLeaderboard currency="both" shop={shopMetrics}/>
    </div>
  </main>;
}
