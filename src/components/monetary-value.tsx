import { convertCurrency, Currency } from "@/types/currency";
import { Shell } from "./shell";
import { cn } from "@/lib/utils";

export function MonetaryValue({
  value,
  currency,
  show,
  mult = 1,
  right = false,
}: {
  value: number;
  currency: Currency;
  show: Currency;
  mult?: number;
  right?: boolean;
}) {
  const converted = convertCurrency(value, currency, show) * mult;
  const formattedAmount =
    show === "usd" ? (
      converted.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      })
    ) : (
      <>
        {converted.toLocaleString()} <Shell size={24} />
      </>
    );

  return (
    <span className={cn("flex items-center gap-2", right && "justify-end")}>
      {formattedAmount}
    </span>
  );
}
