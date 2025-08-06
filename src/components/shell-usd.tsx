"use client";

import { useRef, useState } from "react";
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
  //data: ChartDataPoint[];
  left: string | number;
  right: string | number;
  //refAreaLeft: string | number;
  //refAreaRight: string | number;
  top: string | number;
  bottom: string | number;
}

const chartData = Array.from({ length: 12000 }, (_, i) => ({
  shells: i,
  usd: shellsToUSD(i),
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
  //data: chartData,
  left: "dataMin",
  right: "dataMax",
  //refAreaLeft: "",
  //refAreaRight: "",
  top: "dataMax+1",
  bottom: "dataMin-1",
};

export function ShellUSDChart() {
  const [state, setState] = useState<ZoomState>(initialState);

  const rect = useRef<SVGRectElement>(null);

  const x1 = useRef<number>(null);
  const x2 = useRef<number>(null);
  const i1 = useRef<number>(null);
  const i2 = useRef<number>(null);

  const update = (): void => {
    if (!rect.current) return;

    rect.current.x.baseVal.value =
      x1.current && x2.current ? Math.min(x1.current, x2.current) : 0;
    rect.current.width.baseVal.value =
      x1.current && x2.current ? Math.abs(x2.current - x1.current) : 0;
  };

  const zoom = (): void => {
    if (!(i1.current && i2.current)) return;

    const leftIndex = Math.min(i1.current, i2.current);
    const rigthIndex = Math.max(i1.current, i2.current);

    const [bottom, top] = getAxisDomain(leftIndex, rigthIndex, "usd", 0.1);
    const [leftDomain, rightDomain] = getAxisDomain(
      leftIndex,
      rigthIndex,
      "shells",
      50,
    );

    x1.current = x2.current = i1.current = i2.current = null;
    update();

    setState({
      left: leftDomain,
      right: rightDomain,
      bottom,
      top,
    });
  };

  const zoomOut = (): void => {
    x1.current = x2.current = i1.current = i2.current = null;
    update();

    setState({
      left: "dataMin",
      right: "dataMax",
      top: "dataMax+1",
      bottom: "dataMin-1",
    });
  };

  const { left, right, top, bottom } = state;

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
              data={chartData}
              onMouseDown={(e) => {
                if (e.activeLabel) {
                  x1.current = e.activeCoordinate!.x;
                  i1.current = Number(e.activeLabel!);

                  update();
                }
              }}
              onMouseMove={(e) => {
                if (x1.current && e.activeLabel) {
                  x2.current = e.activeCoordinate!.x;
                  i2.current = Number(e.activeLabel!);

                  update();
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
                content={(props) => (
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
                )}
              />
              <Line dataKey="usd" isAnimationActive={false} type="linear" strokeWidth={2} dot={false} />
              <g className="recharts-layer recharts-reference-area">
                <rect
                  ref={rect}
                  x={0}
                  y={0}
                  width={0}
                  height="100%"
                  fill="var(--chart-1)"
                  fillOpacity={0.1}
                  stroke="none"
                />
              </g>
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
