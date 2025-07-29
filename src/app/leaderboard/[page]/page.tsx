import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LeaderboardUser } from "@/components/user-leaderboard";
import { Button } from "@/components/ui/button";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { fetchLeaderboard } from "@/lib/parth";

export const dynamicParams = false;
export const revalidate = 300;

const PER_PAGE = 10;

export async function generateStaticParams() {
  const leaderboard = await fetchLeaderboard();
  const pages = Math.ceil(leaderboard.total_count / PER_PAGE);
  return Array.from({ length: pages }, (_, i) => ({ page: i.toString() }));
}

export default async function Leaderboard({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const page = Number((await params).page);
  const leaderboard = await fetchLeaderboard();
  const totalShells = leaderboard.entries.reduce((a, b) => a + b.shells, 0);

  const slice = leaderboard.entries.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  const first = 0;
  const last = Math.ceil(leaderboard.entries.length / PER_PAGE) - 1;

  return (
    <main>
      <h1 className="text-3xl font-bold mb-3 text-center">
        Summer of Making economic leaderboard
      </h1>
      <h3 className="text-center mb-8">
        Based off of the latest data from Parth&apos;s API, refreshes every 5 minutes
      </h3>
      <Card className="max-w-4xl mx-auto">
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
                <TableRow key={user.slack_id}>
                  <LeaderboardUser
                    total={totalShells}
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
            {page === first ? (
              <>
                <Button variant="outline" disabled>
                  <ChevronFirst />
                </Button>
                <Button variant="outline" disabled>
                  <ChevronLeft /> Previous
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href={`/leaderboard/${first}`} prefetch>
                    <ChevronFirst />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/leaderboard/${page - 1}`} prefetch>
                    <ChevronLeft /> Previous
                  </Link>
                </Button>
              </>
            )}
            {page === last ? (
              <>
                <Button variant="outline" disabled>
                  Next <ChevronRight />
                </Button>
                <Button variant="outline" disabled>
                  <ChevronLast />
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href={`/leaderboard/${page + 1}`} prefetch>
                    Next <ChevronRight />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/leaderboard/${last}`} prefetch>
                    <ChevronLast />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
