export interface Leaderboard {
  entries: LeaderboardEntry[];
  page: number;
  per_page: number;
  total_count: number;
}

export interface LeaderboardEntry {
  slack_id: string;
  username?: string;
  shells: number;
  rank: number;
  transactions: Transaction[];
  image_24?: string;
  image_32?: string;
  image_48?: string;
  image_72?: string;
  image_192?: string;
  image_512?: string;
}

// User - Admin modification
// ShopOrder - purchases
// ShipEvent - payouts
export type TransactionType = "User" | "ShopOrder" | "ShipEvent";

export interface Transaction {
  id: number;
  type: TransactionType;
  recorded_at: string;
  shellsBefore: number; // before
  shellDiff: number; // + / -
  shellsAfter: number; // after
}

export async function fetchLeaderboard(): Promise<Leaderboard> {
  const lb = await fetch(
    "https://exploresummer.livingfor.me/v1/leaderboard?pullAll=true&historicalData=true",
    {
      cache: "force-cache",
      next: { revalidate: 5 * 60 },
    },
  );

  return await lb.json();
}

export interface User {
  slack_id: string;
  username?: string;
  current_shells: number;
  last_synced: string;
  rank: number;

  transactions: Transaction[];
  projects?: Project[];
  devlogs?: Devlog[];

  pfp_url?: string;
  image_24?: string;
  image_32?: string;
  image_48?: string;
  image_72?: string;
  image_192?: string;
  image_512?: string;

  total_hackatime_hours?: number;
  languages?: string[];
}

export interface Devlog {
  id: number;
  text: string;
  project_id: number;
  created_at: string;
  ai_chance: number;
}

export interface Project {
  id: number;
  title: string;
}

export interface ZippedProject {
  id: number;
  title: string;
  ai_chance: number;
  devlogs: Devlog[];
}

export function zipProjects(
  projects: Project[],
  devlogs: Devlog[],
): ZippedProject[] {
  return projects.map((project) => {
    const zippedDevlogs = devlogs.filter((x) => x.project_id === project.id);

    const ai_chance =
      zippedDevlogs.length === 0
        ? 0
        : Math.max(...zippedDevlogs.map((x) => x.ai_chance)); //zippedDevlogs.reduce((a, b) => a + b.ai_chance, 0) / Math.max(1, zippedDevlogs.length);

    return {
      id: project.id,
      title: project.title,
      ai_chance,
      devlogs: zippedDevlogs,
    };
  });
}

export async function fetchUser(slackId: string): Promise<User> {
  const user = await fetch(
    "https://exploresummer.livingfor.me/v1/users/details?slackId=" + slackId,
    {
      cache: "force-cache",
      next: { revalidate: 5 * 60 },
    },
  );

  return (await user.json())[0];
}

export async function highestProjectID(): Promise<number> {
  const projects = await fetch(
    "https://exploresummer.livingfor.me/v1/mirror/projects?page=1",
    { cache: "force-cache", next: { revalidate: 5 * 60 } },
  );

  return (await projects.json()).projects[0];
}
