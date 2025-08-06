import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeaderboardUser } from "@/components/user-leaderboard";
import { fetchLeaderboard } from "@/lib/parth";

export default async function Purchase({ params }: { params: Promise<{ price: string }> }) {
  const price = -Number((await params).price);

  const leaderboard = await fetchLeaderboard();
  const totalShells = leaderboard.entries.reduce((a, b) => a + b.shells, 0);
  const buyers = leaderboard.entries.filter(x => x.transactions.some(x => x.shellDiff === price && x.type === "ShopOrder"));

  return  <main className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>List of users with a {price} shell shop order</CardTitle>
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
              {buyers.map((user) => (
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
    </main>}
