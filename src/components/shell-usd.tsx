"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { shellsToUSD } from "@/types/currency"
import { MonetaryValue } from "./monetary-value"

export const description = "A linear line chart"

const chartData = Array.from({ length: 15000 / 5  }, (_, i) => ({
  shells: i * 5,
  usd: shellsToUSD(i * 5)
}));

const chartConfig = {
  shells: {
    label: "Shells",
    color: "var(--chart-1)",
  },
  usd: {
    label: "USD",
    color: "var(--chart-2)"
  }
} satisfies ChartConfig

export function ShellUSDChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shell-USD conversion graph</CardTitle>
        <CardDescription>Linear interpolation for shop items, Linear regression for all other values</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="shells"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis/>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent nameKey="usd"
                labelFormatter={(_, [{ payload: { shells }}]) => <MonetaryValue value={shells} currency="shells" show="shells"/>}   />}
            />
            <Line
              dataKey="usd"
              type="linear"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
