import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { fetchUser } from "@/lib/slack";
import type { RankedLeaderboard, RankedUser } from "@/lib/explorpheus";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { MonetaryValue } from "@/components/monetary-value";
import { Currency } from "@/types/currency";
import Link from "next/link";
import { unstable_cacheLife } from "next/cache";

const AMOUNT = 12;

export async function UserLeaderboard({
  leaderboard,
  currency,
  total,
}: {
  leaderboard: RankedLeaderboard;
  currency: Currency;
  total: number;
}) {
  const top = leaderboard.slice(0, AMOUNT);
  const ttop = top.reduce((a, b) => a + b.shells, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
        <CardDescription>
          Top {AMOUNT} out of {leaderboard.length} users with a non-zero balance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Picture</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Balance ({currency})</TableHead>
              <TableHead className="text-right">Market control</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {top.map((user) => (
              <TableRow key={user.slackId}>
                <LeaderboardUser
                  total={total}
                  key={user.slackId}
                  user={user}
                  currency={currency}
                />
              </TableRow>
            ))}
            <TableRow>
              <TableCell />
              <TableCell />
              <TableCell>
                <MonetaryValue value={ttop} currency="shells" show={currency} />
              </TableCell>
              <TableCell className="text-right">
                {((ttop * 100) / total).toFixed(2)}%
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <CardFooter>
          <div className="w-full text-center">
            <Link
              href="/leaderboard/0"
              className="hover:underline text-blue-500"
            >
              Show all
            </Link>
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
}

export async function LeaderboardUser({
  total,
  user,
  currency,
}: {
  user: RankedUser;
  currency: Currency | "both";
  total: number;
}) {
  const {
    profile: { display_name, real_name, image_72 },
  } = await fetchUser(user.slackId);

  return (
    <>
      <TableCell className="font-bold">#{user.rank}</TableCell>
      <TableCell>
        <Image
          unoptimized
          src={
            image_72 ||
            "https://ca.slack-edge.com/T0266FRGM-U015ZPLDZKQ-gf3696467c28-512"
          }
          className="rounded-md"
          width={64}
          height={64}
          alt={display_name || real_name || "Unknown user"}
        />
      </TableCell>
      <TableCell>
        <Link href={`/users/${user.slackId}`} className="underline">
          {display_name || real_name || "<unknown>"}
        </Link>
      </TableCell>
      {currency === "both" ? (
        <>
          <TableCell>
            <MonetaryValue
              value={user.shells}
              currency="shells"
              show="shells"
            />
          </TableCell>

          <TableCell>
            <MonetaryValue value={user.shells} currency="shells" show="USD" />
          </TableCell>
        </>
      ) : (
        <TableCell>
          <MonetaryValue
            value={user.shells}
            currency="shells"
            show={currency}
          />
        </TableCell>
      )}
      <TableCell className="text-right">
        {" "}
        {((user.shells * 100) / total).toFixed(2)}%
      </TableCell>
    </>
  );
}
