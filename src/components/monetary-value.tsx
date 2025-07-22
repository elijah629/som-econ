import { convertCurrency, Currency } from "@/types/currency";
import { Shell } from "./shell";

export function MonetaryValue({ value, currency, show }: { value: number, currency: Currency, show: Currency }) {
  const converted = convertCurrency(value, currency, show);
 const formattedAmount = show === "USD" ? converted.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  }) : <>
      {converted} <Shell size={16}/>
    </>

  return <span className="flex items-center gap-2">
    {formattedAmount}
  </span>
}
