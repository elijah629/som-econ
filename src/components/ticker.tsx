import { cn } from "@/lib/utils";

export function Ticker({ value }: { value: number }) {
  const v = Math.floor(value * 100);
  return (
    <span
      className={cn(
        "text-xs flex items-center justify-center min-w-[46px] p-[6px] text-center rounded-sm",
        v > 0 && "bg-green-400/30 text-green-400 ",
        v === 0 && "bg-secondary text-secondary-foreground",
        v < 0 && "bg-red-500/30 text-red-500",
      )}
    >
      {v > 0 && "+"}
      {v}%
    </span>
  );
}
