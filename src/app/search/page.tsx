import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeaderboardUser } from "@/components/user-leaderboard";
import { fuzzysearch } from "@/lib/fuzzy";
import { notFound } from "next/navigation";
import { fetchLeaderboard } from "@/lib/parth";

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ q: string | undefined }>;
}) {
  const query = (await searchParams).q;

  if (!query) {
    notFound();
  }

  const search = query.toLowerCase();

  const leaderboard = await fetchLeaderboard();
  const totalShells = leaderboard.entries.reduce((a, b) => a + b.shells, 0);

  const matches = leaderboard.entries.filter(
    (x) => x.username && fuzzysearch(search, x.username.toLowerCase()),
  );

  return (
    <main className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
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
              {matches.map((user) => (
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
      </Card>
    </main>
  );
}
