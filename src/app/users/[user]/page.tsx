import { MonetaryValue } from "@/components/monetary-value";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPayouts } from "@/components/user-payouts";
import { fetchLeaderboard } from "@/lib/explorpheus";
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
  const { profile: { display_name, image_192, real_name } } = await fetchUser(slackId);

  return <main>     <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-3xl gap-8">
        <Image className="rounded-xl" src={image_192} width={192} height={192} alt={display_name || real_name}/>
        {display_name || real_name}
      </CardTitle>
      <CardDescription className="flex flex-col">
        <div className="flex items-center gap-4">
        Balance:
        <span className="flex gap-2 items-center">
<MonetaryValue value={lbUser.shells} currency="shells" show="shells" /> ≈ <MonetaryValue value={lbUser.shells} currency="shells" show="USD" />
        </span>
        </div>
        <div>
          Market control: {(lbUser.shells * 100 / total).toFixed(2)}%
        </div>
      </CardDescription>
      </CardHeader>
      <CardContent>
      <UserPayouts payouts={lbUser.payouts}/>
      </CardContent>
    </Card>
  </main>;
}
