import { fetchRawLeaderboard, parseLeaderboard, ranked, RankedUser } from "./explorpheus";
import { fetchUser, SlackProfile } from "./slack";

export type Leaderboard = {
  users: User[],
  totalShells: number
};

export interface User {
  explorpheus: RankedUser,
  slack: SlackProfile
}

export async function fetchLeaderboard(): Promise<Leaderboard> {
  const leaderboard = ranked(parseLeaderboard(await fetchRawLeaderboard()));
  // const profiles = await allRatelimited(leaderboard.map(x => () => fetchUser(x.slackId)), 60_000 * 5);
  // const profiles = await Promise.all(leaderboard.map(x => fetchUser(x.slackId)));
  const profiles: SlackProfile[] = [];

  for (const user of leaderboard) {
    profiles.push(await fetchUser(user.slackId));
  }

  return { users: leaderboard.map((explorpheus, i) => ({
    explorpheus,
    slack: profiles[i]
  })), totalShells: leaderboard.reduce((a, b) => a + b.shells, 0) };
}

async function allRatelimited<T>(
  promises: Array<() => Promise<T>>,
  fulfillmentsPerMinute: number
): Promise<T[]> {
  const results: T[] = new Array(promises.length);
  const delayMs = 60000 / fulfillmentsPerMinute;

  for (let i = 0; i < promises.length; i++) {
    const index = i;
    const fn = promises[index];

    results[index] = await fn();

    if (i < promises.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  return results;
}
