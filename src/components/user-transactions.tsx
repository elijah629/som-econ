"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";

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
import { Transaction } from "@/lib/parth";

const chartConfig = {
  shellDiff: {
    label: "Amount",
  },
  shellsAfter: {
    label: "Cumulative Amount",
  },
  recorded_at: {
    label: "Created At",
  },
  type: {
    label: "Type",
  },
  id: {
    label: "Id",
  },
} satisfies ChartConfig;

const gradientOffset = (data: Transaction[]) => {
  const dataMax = Math.max(...data.map((i) => i.shellDiff));
  const dataMin = Math.min(...data.map((i) => i.shellDiff));

  if (dataMax <= 0) return 0;
  if (dataMin >= 0) return 1;

  return dataMax / (dataMax - dataMin);
};

export function UserTransactions({
  transactions: tx,
}: {
  transactions: Transaction[];
}) {
  const transactions = tx.toReversed();
  const off = gradientOffset(transactions);

  return (
    <Card className="grow">
      <CardHeader>
        <CardTitle>Transactions ({transactions.length})</CardTitle>
        <CardDescription>All user Transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ComposedChart
            data={transactions}
          >
            <CartesianGrid />
            <XAxis
              dataKey="recorded_at"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                value &&
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={(props: CustomTooltipProps) => (
                <ChartTooltipContent {...props} indicator="line" />
              )}
            />
            <defs>
              <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset={off} stopColor="green" stopOpacity={1} />
                <stop offset={off} stopColor="red" stopOpacity={1} />
              </linearGradient>
            </defs>

            <Area
              dataKey="shellDiff"
              type="monotone"
              isAnimationActive={false}
              fill="url(#splitColor)"
              fillOpacity={0.4}
              strokeOpacity={0}
            />

            <Line
              type="monotone"
              dataKey="shellsAfter"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={false}
            />

            <Line dataKey="type" />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
