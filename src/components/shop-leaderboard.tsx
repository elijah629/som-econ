import { ShopMetrics } from "@/lib/metrics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MonetaryValue } from "@/components/monetary-value";
import { Currency } from "@/types/currency";

export function ShopLeaderboard({
  shop,
  currency,
}: {
  shop: ShopMetrics;
  currency: Currency | "both";
}) {
  const totalValue = shop.reduce((a, b) => a + b.value * b.purchases, 0);
  const totalPurchases = shop.reduce((a, b) => a + b.purchases, 0);

  return (
    <Card>
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
              <TableHead>Approx purchases</TableHead>
              {currency === "both" ? (
                <>
                  <TableHead className="text-right">Value (shells)</TableHead>
                  <TableHead className="text-right">Value (USD)</TableHead>
                </>
              ) : (
                <TableHead className="text-right">Value ({currency})</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {shop.map(({ name, purchases, value }) => (
              <TableRow key={name}>
                <TableCell className="whitespace-normal break-words">
                  {name}
                </TableCell>
                <TableCell>{purchases}</TableCell>
                {currency === "both" ? (
                  <>
                    <TableCell>
                      <MonetaryValue
                        right
                        value={value}
                        mult={purchases}
                        currency="shells"
                        show="shells"
                      />
                    </TableCell>
                    <TableCell>
                      <MonetaryValue
                        right
                        value={value}
                        mult={purchases}
                        currency="shells"
                        show="usd"
                      />
                    </TableCell>
                  </>
                ) : (
                  <TableCell>
                    <MonetaryValue
                      right
                      value={value}
                      mult={purchases}
                      currency="shells"
                      show={currency}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
            <TableRow>
              <TableCell className="font-bold">Total</TableCell>
              <TableCell>{totalPurchases}</TableCell>
              {currency === "both" ? (
                <>
                  <TableCell>
                    <MonetaryValue
                      right
                      value={totalValue}
                      currency="shells"
                      show="shells"
                    />
                  </TableCell>
                  <TableCell>
                    <MonetaryValue
                      right
                      value={totalValue}
                      currency="shells"
                      show="usd"
                    />
                  </TableCell>
                </>
              ) : (
                <TableCell>
                  <MonetaryValue
                    right
                    value={totalValue}
                    currency="shells"
                    show={currency}
                  />
                </TableCell>
              )}
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
