"use client";

import { normalizeZero, type IoMetrics } from "@/lib/metrics";
import { Area, CartesianGrid, ComposedChart, Line, XAxis } from "recharts";
import * as React from "react";

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
import { Currency } from "@/types/currency";
import { MonetaryValue } from "./monetary-value";

const chartConfig = {
  tx: {
    in: {
      label: "Payouts",
      color: "var(--chart-1)",
    },
    out: {
      label: "Purchases",
      color: "var(--chart-5)",
    },
    total: {
      label: "Total",
    },
    cumulativeTotal: {
      label: "Current Transactions",
    },
  } satisfies ChartConfig,
  net: {
    in: {
      label: "Minted",
      color: "var(--chart-1)",
    },
    out: {
      label: "Destroyed",
      color: "var(--chart-5)",
    },
    total: {
      label: "Volume",
    },
    cumulativeTotal: {
      label: "Current Supply",
    },
  } satisfies ChartConfig,
};

const chartLabels = { tx: "Transactions", net: "Held shells (Net)" };
const currencies = { tx: null, net: "shells" } satisfies Record<
  string,
  Currency | null
>;

export function CountMetrics({
  currency,
  net,
  transaction,
}: {
  currency: Currency;
  net: IoMetrics;
  transaction: IoMetrics;
}) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("net");

  const chartData = {
    net: normalizeZero(net),
    tx: normalizeZero(transaction),
  };

  const total = {
    net: net.at(-1)!.cumulativeTotal,
    tx: transaction.at(-1)!.cumulativeTotal,
  };

  return (
    <Card className="py-0 grow">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle>Market I/O</CardTitle>
          <CardDescription>
            Incoming, Outgoing, and Total for Net and Transaction values.
          </CardDescription>
        </div>
        <div className="flex">
          {["net", "tx"].map((key) => {
            const chart = key as keyof typeof chartConfig;

            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartLabels[chart]}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {currencies[chart] ? (
                    <MonetaryValue
                      value={total[chart]}
                      currency={currencies[chart]}
                      show={currency}
                    />
                  ) : (
                    total[chart].toLocaleString()
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig[activeChart]}>
          <ComposedChart
            accessibilityLayer
            stackOffset="expand"
            data={chartData[activeChart]}
            margin={{
              left: 12,
              right: 12,
              top: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                value.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="in"
              type="monotone"
              fill="var(--chart-2)"
              fillOpacity={0.4}
              stroke="var(--chart-2)"
              stackId="a"
              yAxisId="a"
            />
            <Area
              dataKey="out"
              type="monotone"
              fill="var(--chart-5)"
              fillOpacity={0.3}
              stroke="var(--chart-5)"
              stackId="a"
              yAxisId="a"
            />
            <Line
              dataKey="total"
              //type="monotone"
              //strokeWidth={2}
              yAxisId="b"
              opacity={0}
              dot={false}
              fillOpacity={0}
              strokeOpacity={0}
              fill="none"
              stroke="none"
            />
            <Line
              type="monotone"
              dataKey="cumulativeTotal"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
