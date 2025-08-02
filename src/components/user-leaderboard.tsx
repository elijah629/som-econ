import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
import { Leaderboard, LeaderboardEntry } from "@/lib/parth";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";

const AMOUNT = 10;

export async function UserLeaderboard({
  leaderboard,
  currency,
  total,
}: {
  leaderboard: Leaderboard;
  currency: Currency;
  total: number;
}) {
  const top = leaderboard.entries.slice(0, AMOUNT);
  const topTotal = top.reduce((a, b) => a + b.shells, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
        <CardDescription>
          Top {AMOUNT} out of {leaderboard.entries.length} users with at least
          one transactions
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
              <TableRow key={user.slack_id}>
                <LeaderboardUser
                  total={total}
                  user={user}
                  currency={currency}
                />
              </TableRow>
            ))}
            <TableRow>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell>
                <MonetaryValue
                  value={topTotal}
                  currency="shells"
                  show={currency}
                />
              </TableCell>
              <TableCell className="text-right">
                {((topTotal * 100) / total).toFixed(2)}%
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <CardFooter>
          <div className="w-full text-center mt-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/leaderboard/0">
                <ChevronDown />
                Show all
              </Link>
            </Button>
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
}

export async function LeaderboardUser({
  total,
  user: { rank, username, shells, image_72, slack_id },
  currency,
}: {
  user: LeaderboardEntry;
  currency: Currency | "both";
  total: number;
}) {
  return (
    <>
      <TableCell className="font-bold">#{rank}</TableCell>
      <TableCell>
        <Image
          unoptimized
          src={
            image_72 ||
            "https://ca.slack-edge.com/T0266FRGM-U015ZPLDZKQ-gf3696467c28-72"
          }
          className="rounded-md"
          width={64}
          height={64}
          alt={username || "Unknown user"}
        />
      </TableCell>
      <TableCell>
        <Link href={`/users/${slack_id}`} className="underline">
          {username || "<unknown>"}
        </Link>
      </TableCell>
      {currency === "both" ? (
        <>
          <TableCell>
            <MonetaryValue value={shells} currency="shells" show="shells" />
          </TableCell>

          <TableCell>
            <MonetaryValue value={shells} currency="shells" show="usd" />
          </TableCell>
        </>
      ) : (
        <TableCell>
          <MonetaryValue value={shells} currency="shells" show={currency} />
        </TableCell>
      )}
      <TableCell className="text-right">
        {((shells * 100) / total).toFixed(2)}%
      </TableCell>
    </>
  );
}
