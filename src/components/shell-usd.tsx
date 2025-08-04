"use client";

import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ReferenceArea,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { shellsToUSD } from "@/types/currency";
import { MonetaryValue } from "./monetary-value";

interface ChartDataPoint {
  shells: number;
  usd: number;
}

interface ZoomState {
  data: ChartDataPoint[];
  left: string | number;
  right: string | number;
  refAreaLeft: string | number;
  refAreaRight: string | number;
  top: string | number;
  bottom: string | number;
}

const chartData = Array.from({ length: 15000 / 5 }, (_, i) => ({
  shells: i * 5,
  usd: shellsToUSD(i * 5),
}));

const chartConfig = {
  shells: {
    label: "Shells",
    color: "var(--chart-1)",
  },
  usd: {
    label: "USD",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const getAxisDomain = (
  from: number,
  to: number,
  ref: keyof ChartDataPoint,
  offset: number,
): [number, number] => {
  const refData = chartData.slice(from, to + 1);
  if (refData.length === 0) return [0, 1];

  let bottom = refData[0][ref];
  let top = refData[0][ref];

  refData.forEach((d) => {
    if (d[ref] > top) top = d[ref];
    if (d[ref] < bottom) bottom = d[ref];
  });

  return [Math.floor(bottom) - offset, Math.ceil(top) + offset];
};

const initialState: ZoomState = {
  data: chartData,
  left: "dataMin",
  right: "dataMax",
  refAreaLeft: "",
  refAreaRight: "",
  top: "dataMax+1",
  bottom: "dataMin-1",
};

export function ShellUSDChart() {
  const [state, setState] = useState<ZoomState>(initialState);

  const zoom = (): void => {
    let { refAreaLeft, refAreaRight } = state;
    const { data } = state;

    if (refAreaLeft === refAreaRight || refAreaRight === "") {
      setState((prevState) => ({
        ...prevState,
        refAreaLeft: "",
        refAreaRight: "",
      }));
      return;
    }

    const leftValue = Number(refAreaLeft);
    const rightValue = Number(refAreaRight);

    if (leftValue > rightValue) {
      [refAreaLeft, refAreaRight] = [rightValue, leftValue];
    } else {
      [refAreaLeft, refAreaRight] = [leftValue, rightValue];
    }

    const leftIndex = Math.max(
      0,
      data.findIndex((item) => item.shells >= Number(refAreaLeft)),
    );
    const rightIndex = Math.min(
      data.length - 1,
      data.findIndex((item) => item.shells >= Number(refAreaRight)),
    );

    if (leftIndex === -1 || rightIndex === -1) return;

    const [bottom, top] = getAxisDomain(leftIndex, rightIndex, "usd", 0.1);
    const [leftDomain, rightDomain] = getAxisDomain(
      leftIndex,
      rightIndex,
      "shells",
      50,
    );

    setState((prevState) => ({
      ...prevState,
      refAreaLeft: "",
      refAreaRight: "",
      data: data.slice(),
      left: leftDomain,
      right: rightDomain,
      bottom,
      top,
    }));
  };

  const zoomOut = (): void => {
    setState((prevState) => ({
      ...prevState,
      data: chartData.slice(),
      refAreaLeft: "",
      refAreaRight: "",
      left: "dataMin",
      right: "dataMax",
      top: "dataMax+1",
      bottom: "dataMin-1",
    }));
  };

  const { data, refAreaLeft, refAreaRight, left, right, top, bottom } = state;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Shell-USD conversion graph
          <Button variant="outline" size="sm" onClick={zoomOut}>
            Zoom Out
          </Button>
        </CardTitle>
        <CardDescription>
          Linear interpolation for shop items, Linear regression for all other
          values. Click and drag to zoom into a specific area.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ userSelect: "none", width: "100%" }}>
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={data}
              onMouseDown={(e) => {
                if (e?.activeLabel) {
                  setState((prevState) => ({
                    ...prevState,
                    refAreaLeft: e.activeLabel!,
                  }));
                }
              }}
              onMouseMove={(e) => {
                if (state.refAreaLeft && e?.activeLabel) {
                  setState((prevState) => ({
                    ...prevState,
                    refAreaRight: e.activeLabel!,
                  }));
                }
              }}
              onMouseUp={zoom}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                allowDataOverflow
                dataKey="shells"
                domain={[left, right]}
                type="number"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                allowDataOverflow
                domain={[bottom, top]}
                tickFormatter={(x: number) => (x | 0).toString()}
                type="number"
              />
              <ChartTooltip
                cursor={false}
                content={(props) =>
                  <ChartTooltipContent
                    {...props}
                    nameKey="usd"
                    labelFormatter={(
                      _,
                      [
                        {
                          payload: { shells },
                        },
                      ],
                    ) => (
                      <MonetaryValue
                        value={shells}
                        currency="shells"
                        show="shells"
                      />
                    )}
                    />
                }
              />
              <Line dataKey="usd" type="linear" strokeWidth={2} dot={false} />
              {refAreaLeft && refAreaRight ? (
                <ReferenceArea
                  x1={refAreaLeft}
                  x2={refAreaRight}
                  strokeOpacity={0.3}
                  fill="var(--chart-1)"
                  fillOpacity={0.1}
                />
              ) : null}
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// the above is the below combined with https://recharts.org/en-US/examples/HighlightAndZoomLineChart

/*"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

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
import { shellsToUSD } from "@/types/currency";
import { MonetaryValue } from "./monetary-value";

const chartData = Array.from({ length: 15000 / 5 }, (_, i) => ({
  shells: i * 5,
  usd: shellsToUSD(i * 5),
}));

const chartConfig = {
  shells: {
    label: "Shells",
    color: "var(--chart-1)",
  },
  usd: {
    label: "USD",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ShellUSDChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shell-USD conversion graph</CardTitle>
        <CardDescription>
          Linear interpolation for shop items, Linear regression for all other
          values
        </CardDescription>
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
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  nameKey="usd"
                  labelFormatter={(
                    _,
                    [
                      {
                        payload: { shells },
                      },
                    ],
                  ) => (
                    <MonetaryValue
                      value={shells}
                      currency="shells"
                      show="shells"
                    />
                  )}
                />
              }
            />
            <Line dataKey="usd" type="linear" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}*/
