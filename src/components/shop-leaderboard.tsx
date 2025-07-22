import { ShopMetrics } from "@/lib/metrics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

export function ShopLeaderboard({ shop }: { shop: ShopMetrics }) {
  return  <Card>
      <CardHeader>
        <CardTitle>Shop Leaderboard</CardTitle>
        <CardDescription>
        Approximated from prices and user spending behaviour
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Purchases</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shop.map(({ name, purchases }) => (
              <TableRow key={name}>
              <TableCell>{name}</TableCell>
              <TableCell>{purchases}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card> ;
}
