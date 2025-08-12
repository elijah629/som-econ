import { Leaderboard } from "./parth";

export function search(
  leaderboard: Leaderboard,
  search: string,
): Leaderboard["entries"] {
  return leaderboard.entries
    .reduce<{ entry: (typeof leaderboard.entries)[0]; dist: number }[]>(
      (acc, entry) => {
        if (!entry.username) return acc;

        if (fuzzysearch(search, entry.username)) {
          acc.push({ entry, dist: levenshtein(search, entry.username) });
        }
        return acc;
      },
      [],
    )
    .sort((a, b) => a.dist - b.dist)
    .map(({ entry }) => entry);
}

export function fuzzysearch(needle: string, haystack: string): boolean {
  if (needle === haystack) return true;

  const nlen = needle.length;
  const hlen = haystack.length;
  if (nlen > hlen) return false;

  const lowerNeedle = needle.toLowerCase();
  const lowerHaystack = haystack.toLowerCase();

  if (nlen === hlen) return lowerNeedle === lowerHaystack;

  let j = 0;
  outer: for (let i = 0; i < nlen; i++) {
    const nch = lowerNeedle.charAt(i);
    while (j < hlen) {
      if (lowerHaystack.charAt(j++) === nch) {
        continue outer;
      }
    }
    return false;
  }
  return true;
}

export function levenshtein(a: string, b: string): number {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        );
      }
    }
  }
  return matrix[b.length][a.length];
}
