import { fetchLeaderboard, ranked } from "@/lib/explorpheus";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Leaderboard } from "@/lib/explorpheus";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LeaderboardUser } from "@/components/user-leaderboard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export const dynamicParams = false;
export const dynamic = 'force-static';

const PER_PAGE = 10;

export async function generateStaticParams() {
  const pages = Math.ceil((await fetchLeaderboard()).length / PER_PAGE);

  return Array.from({ length: pages }, (_, i) => ({ page: i.toString() }));
}

export default async function Leaderboard({ params }: { params: Promise<{ page: string }> }) {
  const page = Number((await params).page);
  const leaderboard = ranked(await fetchLeaderboard());
  const slice = leaderboard.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const total = leaderboard.reduce((a, b) => a + b.shells, 0);

  return <main>
      <h1 className="text-3xl font-bold mb-3 text-center">
      Summer of Making economic leaderboard
      </h1>
      <h3 className="text-center mb-8">
        Based off of the latest data from the explorpheus API, refreshes every
        hour
      </h3>
    <Card>
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Picture</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Balance (shells)</TableHead>
              <TableHead>Balance (USD)</TableHead>
              <TableHead className="text-right">Market control</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slice.map((user) => (
              <TableRow key={user.slackId}>
                <LeaderboardUser
                  total={total}
                  key={user.slackId}
                  user={user}
                  currency="both"
                />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="flex justify-center items-center w-full gap-2">
          {page === 0 ?
          <Button variant="outline" disabled>
              <ChevronLeft/> Previous
          </Button>
          :

          <Button variant="outline" asChild>
            <Link href={`/leaderboard/${page - 1}`}>
              <ChevronLeft/> Previous
            </Link>
          </Button>}
          {page === Math.ceil(leaderboard.length / PER_PAGE) - 1 ?  <Button variant="outline" disabled>Next <ChevronRight/></Button> : <Button  variant="outline" asChild>
<Link href={`/leaderboard/${page + 1}`}>
              Next <ChevronRight/>
            </Link>

          </Button>}
        </div>
        </CardFooter>
    </Card>
  </main>
}
