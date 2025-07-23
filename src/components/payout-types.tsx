"use client"

import { Pie, PieChart } from "recharts"

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { PayoutMetrics } from "@/lib/metrics"

const chartConfig = {
  count: {
    label: "Count",
  },
  "ShopOrder": {
    label: "Shop Order"
  },
  "ShipEvent": { label: "Ship Event" },
  "User": { label: "User"  }
} satisfies ChartConfig

export function PayoutTypes({ payout }: { payout: PayoutMetrics }) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Payout Types</CardTitle>
        <CardDescription>Collective percent of payout types</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[600px]"
        >
          <PieChart>
<ChartTooltip
              cursor={false}
              content={<ChartTooltipContent nameKey="type" hideLabel />}
            />
            <Pie data={payout.map((x, i) => ({ ...x, fill: "var(--chart-" + (i + 1) + ")" }))} dataKey="count" nameKey="type" />
            <ChartLegend
              content={<ChartLegendContent nameKey="type" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
