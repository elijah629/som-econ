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
import { fetchLeaderboard } from "@/lib/leaderboard";
import { notFound } from "next/navigation";

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

  const { users: leaderboard, totalShells } = await fetchLeaderboard();

  const matches = leaderboard.filter(x => fuzzysearch(search, (x.slack.display_name || x.slack.real_name || "").toLowerCase()));

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
                <TableRow key={user.explorpheus.slackId}>
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
