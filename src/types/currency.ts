export type Currency = "USD" | "shells";

export function convertCurrency(fromValue: number, fromCurrency: Currency, targetCurrency: Currency): number {
  return fromCurrency === targetCurrency ? fromValue : fromCurrency === "USD" && targetCurrency === "shells" ? fromValue / 0.20 : fromValue * 0.20;
}
