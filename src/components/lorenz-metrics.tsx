"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { LorenzMetrics } from "@/lib/metrics";
import { cn } from "@/lib/utils";

const chartConfig = {
  population: {
    label: "Bottom % of Population",
  },
  wealth: {
    label: "% of Total Wealth",
  },
} satisfies ChartConfig;

export function LorenzMetrics({
  lorenz,
  gini,
}: {
  lorenz: LorenzMetrics;
  gini: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wealth distribution</CardTitle>
        <CardDescription>
          Lorenz chart of current wealth. Bottom X% controls Y% of wealth
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={lorenz}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="population"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(x) => Math.round(x).toString()}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="wealth"
              type="linear"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="population"
              type="linear"
              stroke="var(--chart-3)"
              strokeWidth={4}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div
          className={cn(
            "text-muted-foreground leading-none",
            gini < 0.3
              ? "text-green-300"
              : gini < 0.5
                ? "text-orange-300"
                : "text-red-400",
          )}
        >
          Inequality (Gini) {(gini * 100).toFixed(2)}%
        </div>
      </CardFooter>
    </Card>
  );
}
