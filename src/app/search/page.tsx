import { fetchLeaderboard, ranked } from "@/lib/explorpheus";
import { fetchUser } from "@/lib/slack";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeaderboardUser } from "@/components/user-leaderboard";
import { SearchBar } from "@/components/search-bar";
import { fuzzysearch } from "@/lib/fuzzy";

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ q: string | undefined }>;
}) {
  const query = (await searchParams).q;

  if (!query) {
    return <SearchBar />;
  }

  const search = query.toLowerCase();

  const leaderboard = ranked(await fetchLeaderboard());
  const total = leaderboard.reduce((a, b) => a + b.shells, 0);

  const matches = [];

  for (const user of leaderboard) {
    const {
      profile: { display_name, real_name },
    } = await fetchUser(user.slackId);

    const identifier = display_name || real_name;

    if (fuzzysearch(search, identifier.toLowerCase())) {
      matches.push(user);

      if (matches.length === 10) {
        break;
      }
    }
  }

  return (
    <main className="flex flex-col gap-4">
      <SearchBar query={query} />
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
      </Card>
    </main>
  );
}
