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
} from "@/components/ui/chart";
import { Payout } from "@/lib/explorpheus";

export const description = "A simple area chart";

const chartConfig = {
  amount: {
    label: "Amount",
  },
  cumulative: {
    label: "Cumulative Amount",
  },
  createdAt: {
    label: "Created At",
  },
  type: {
    label: "Type",
  },
  id: {
    label: "Id",
  },
} satisfies ChartConfig;

const gradientOffset = (data: Payout[]) => {
  const dataMax = Math.max(...data.map((i) => i.amount));
  const dataMin = Math.min(...data.map((i) => i.amount));

  if (dataMax <= 0) return 0;
  if (dataMin >= 0) return 1;

  return dataMax / (dataMax - dataMin);
};

function withCumulative(payouts: Payout[]) {
  let sum = 0;
  return payouts
    .slice()
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
    .map((p) => {
      sum += p.amount;
      return {
        ...p,
        cumulative: sum,
      };
    });
}

export function UserPayouts({ payouts }: { payouts: Payout[] }) {
  const dataWithCumulative = withCumulative(payouts);
  const off = gradientOffset(payouts);

  return (
    <Card className="grow">
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>All user Transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ComposedChart
            accessibilityLayer
            data={dataWithCumulative}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="createdAt"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <defs>
              <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset={off} stopColor="green" stopOpacity={1} />
                <stop offset={off} stopColor="red" stopOpacity={1} />
              </linearGradient>
            </defs>

            <Area
              dataKey="amount"
              type="monotone"
              fill="url(#splitColor)"
              fillOpacity={0.4}
              strokeOpacity={0}
            />

            <Line
              type="monotone"
              dataKey="cumulative"
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
