import { fetchUser } from "@/lib/slack";
import type { Leaderboard, User } from "@/lib/explorpheus";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { MonetaryValue } from "./monetary-value";
import { Currency } from "@/types/currency";

export async function UserLeaderboard({
  leaderboard,
  currency,
  total
}: {
  leaderboard: Leaderboard;
  currency: Currency,
  total: number,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {leaderboard.slice(0, 10).map((user) => (
            <LeaderboardUser total={total} key={user.slackId} user={user} currency={currency} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export async function LeaderboardUser({ total, user, currency }: { user: User, currency: Currency, total: number }) {
  const {
    profile: { display_name, real_name, image_72 },
  } = await fetchUser(user.slackId);

  return (
    <div className="flex justify-between items-center gap-4 py-3 px-4 rounded-md bg-secondary">
      <Image
        src={
          image_72 ||
          "https://ca.slack-edge.com/T0266FRGM-U015ZPLDZKQ-gf3696467c28-512"
        }
        className="rounded-md"
        width={64}
        height={64}
        alt={display_name || real_name || "Unknown user"}
      />
      <span>{display_name || real_name || "<unknown>"}</span>
<MonetaryValue value={user.shells} currency="shells" show={currency}/>
      {(user.shells * 100 / total).toFixed(2)}%
    </div>
  );
}
