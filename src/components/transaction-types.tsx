"use client";

import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  CustomTooltipProps,
} from "@/components/ui/chart";
import { TransactionTypeMetrics } from "@/lib/metrics";

const chartConfig = {
  ShopOrder: {
    label: "Shop Order",
  },
  ShipEvent: { label: "Ship Event" },
  User: { label: "User" },
} satisfies ChartConfig;

export function TransactionTypes({
  transactionTypes,
}: {
  transactionTypes: TransactionTypeMetrics;
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Transaction types</CardTitle>
        <CardDescription>
          Collective percent of transaction types
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[600px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={(props: CustomTooltipProps) => (
                <ChartTooltipContent {...props} nameKey="type" hideLabel />
              )}
            />
            <Pie
              data={transactionTypes.map(
                (x, i) => (
                  console.log(x),
                  {
                    ...x,
                    fill: "var(--chart-" + (i + 1) + ")",
                  }
                ),
              )}
              dataKey="count"
              nameKey="type"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
