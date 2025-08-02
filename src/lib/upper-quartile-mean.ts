export function upperQuartileMean(nums: number[]): number {
  const index = Math.floor(nums.length * 0.75);
  const upperQ = nums.slice(index);

  const sum = upperQ.reduce((a, b) => a + b);
  const mean = sum / upperQ.length;

  return mean;
}
