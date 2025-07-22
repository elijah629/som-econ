import { cn } from "@/lib/utils";

export function Ticker({ value }: { value: number }) {
  return <span className={cn("text-xs flex items-center justify-center min-w-[46px] p-[6px] text-center rounded-sm", value > 0 && "bg-green-400/30 text-green-400 ", value === 0 && "bg-secondary text-secondary-foreground", value < 0 && "bg-red-500/30 text-red-500" )}>{value > 0 && "+"}{Math.floor(value * 100)}%</span>;
}
