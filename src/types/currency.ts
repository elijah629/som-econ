export type Currency = "USD" | "shells";

export function convertCurrency(
  fromValue: number,
  fromCurrency: Currency,
  targetCurrency: Currency,
): number {
  return fromCurrency === targetCurrency
    ? fromValue
    : fromCurrency === "USD" && targetCurrency === "shells"
      ? usdToShells(fromValue)
      : shellsToUSD(fromValue);
}

const shellsUSD = [
  [5, 0], // Badges
  [10, 0], // Badges
  [25, 5],
  [27, 5],
  [33, 5],
  [40, 0], // SoM blue
  [45, 10],
  [50, 10],
  [55, 14.99],
  [60, 14.99],
  [65, 14.99],
  [66, 10],
  [80, 11.99],
  [91, 13.99],
  [92, 5],
  [97, 9.99],
  [98, 14.99],
  [100, 15], // could be 0 for pw & sunglasses, but something else is 100
  [102, 20],
  [103, 20],
  [110, 29.99],
  [115, 19.99],
  [120, 19.99],
  [122, 38],
  [125, 19.99],
  [130, 20],
  [137, 24.99],
  [144, 35.99],
  [145, 38],
  [147, 9.99],
  [150, 0], // offshore bank
  [162, 31.98],
  [160, 0], // SoM Mgold
  [170, 25],
  [175, 35],
  [180, 29.99],
  [182, 18],
  [216, 5.87 * 6], // mulvad for 6 mo
  [220, 10],
  [237, 31.98],
  [250, 42.99],
  [260, 39.99],
  [300, 50],
  [330, 55],
  [350, 50],
  [360, 69],
  [375, 50],
  [398, 54.99],
  [400, 50],
  [427, 54.59],
  [448, 54.99],
  [460, 67],
  [492, 89.99],
  [502, 54.59],
  [542, 89.99],
  [595, 119.99],
  //[620, 119.99],
  //[630, 199.99],
  //[632, 199.99],
  [657, 199.99],
  [665, 299],
  [670, 119.99],
  [690, 299],
  [762, 179],
  [770, 159.99],
  [775, 149.99],
  [812, 179],
  [820, 159.99],
  [850, 149.99],
  [950, 199],
  [1000, 0], // I am Rich
  [1020, 329],
  [1125, 249],

  [1135, 299],
  [1150, 249],
  [1170, 329],
  [1175, 299],
  [1320, 329],
  [1390, 229],
  [1475, 249],
  [1500, 249],
  [1520, 329],
  [1540, 299], // Combined Nothing phone + ThinkPad
  [1632, 299],
  [1640, 279],
  [1740, 357],
  [1750, 500],
  [1775, 349],
  [1790, 279],
  [1800, 310],
  [1820, 329],
  [1915, 279],
  [2100, 349],
  [2550, 495],
  [3400, 428],
  [3540, 549],
  [3600, 773],
  [4050, 599],
  [4499, 549],
  [5500, 999],
  [5612, 999],
  [5750, 999],
  [5800, 999],
  [5875, 999],
  [6000, 999],
  [6250, 999],
  [8995, 1599],
  [9245, 1599],
  [11075, 1599],
  [12665, 1599],
];

const usdShells = shellsUSD
  .map(([shells, usd]) => [usd, shells])
  .sort((a, b) => a[0] - b[0]);

const a = 0.7275;
const b = 0.8285;

export function shellsToUSD(shells: number): number {
  if (shells > 8995) {
    return a * Math.pow(shells, b);
  }

  let low = 0;
  let high = shellsUSD.length - 1;

  while (low <= high) {
    const mid = (low + high) >> 1;
    const sMid = shellsUSD[mid][0];

    if (sMid < shells) {
      low = mid + 1;
    } else if (sMid > shells) {
      high = mid - 1;
    } else {
      return shellsUSD[mid][1];
    }
  }

  const i = Math.max(0, Math.min(shellsUSD.length - 2, high));
  const [s0, u0] = shellsUSD[i];
  const [s1, u1] = shellsUSD[i + 1];
  const t = (shells - s0) / (s1 - s0);
  return u0 + t * (u1 - u0);
}

export function usdToShells(usd: number): number {
  if (usd > 1599) {
    return Math.pow(usd / a, 1 / b);
  }

  let low = 0;
  let high = usdShells.length - 1;

  while (low <= high) {
    const mid = (low + high) >> 1;
    const uMid = usdShells[mid][0];

    if (uMid === usd) {
      return usdShells[mid][1];
    } else if (uMid < usd) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  const i = Math.max(0, Math.min(usdShells.length - 2, high));
  const [u0, s0] = usdShells[i];
  const [u1, s1] = usdShells[i + 1];
  const t = (usd - u0) / (u1 - u0);
  return s0 + t * (s1 - s0);
}
