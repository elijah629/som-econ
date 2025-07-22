export type Currency = "USD" | "shells";

export function convertCurrency(
  fromValue: number,
  fromCurrency: Currency,
  targetCurrency: Currency,
): number {
  return fromCurrency === targetCurrency
    ? fromValue
    : fromCurrency === "USD" && targetCurrency === "shells"
      ? fromValue / 0.2
      : fromValue * 0.2;
}
