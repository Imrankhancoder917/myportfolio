import { PLATFORM_COLORS, PLATFORM_NAMES } from "@/lib/constants/config";
import { getAdapterStats, type AdapterType, type PlatformConfig } from "@/lib/adapters";
import type { UnifiedAnalytics } from "@/lib/types/analytics";

export type AnalyticsPlatformKey = AdapterType | "all";

export type PlatformStatus = "connected" | "missing" | "error";

export interface AnalyticsAccountConfig extends PlatformConfig {
  label: string;
  color: string;
  description: string;
}

export interface SerializedAnalytics extends Omit<UnifiedAnalytics, "lastUpdated"> {
  lastUpdated: string;
}

export interface DashboardPlatformSnapshot extends AnalyticsAccountConfig {
  status: PlatformStatus;
  analytics: SerializedAnalytics | null;
  error?: string;
}

export interface DashboardSummary {
  totalProblems: number;
  totalContests: number;
  avgStreak: number;
  maxStreak: number;
  platformCount: number;
  supportedCount: number;
  completionRate: number;
  lastUpdated: string;
  topPlatform: {
    platform: AdapterType;
    label: string;
    totalSolved: number;
    contests: number;
    color: string;
  } | null;
}

export interface AnalyticsDashboardData {
  generatedAt: string;
  summary: DashboardSummary;
  platforms: DashboardPlatformSnapshot[];
}

const platformAccounts: Array<AnalyticsAccountConfig & { envUserKey: string; envTokenKey?: string }> = [
  {
    platform: "leetcode",
    label: PLATFORM_NAMES.leetcode,
    color: PLATFORM_COLORS.leetcode,
    description: "Interview problem solving",
    username: "Imran_Khan_87",
    envUserKey: "LEETCODE_USERNAME",
  },
  {
    platform: "codeforces",
    label: PLATFORM_NAMES.codeforces,
    color: PLATFORM_COLORS.codeforces,
    description: "Contest performance and rating",
    username: process.env.CODEFORCES_HANDLE ?? "Imrankhan87",
    envUserKey: "CODEFORCES_HANDLE",
  },
  {
    platform: "codechef",
    label: PLATFORM_NAMES.codechef,
    color: PLATFORM_COLORS.codechef,
    description: "Algorithmic contests and ladders",
    username: "imran_khan_87",
    envUserKey: "CODECHEF_USERNAME",
  },
  {
    platform: "hackerrank",
    label: PLATFORM_NAMES.hackerrank,
    color: PLATFORM_COLORS.hackerrank,
    description: "Skill badges and challenges",
    username: process.env.HACKERRANK_USERNAME ?? "Imran_khan_87",
    envUserKey: "HACKERRANK_USERNAME",
  },
  {
    platform: "gfg",
    label: PLATFORM_NAMES.gfg,
    color: PLATFORM_COLORS.gfg,
    description: "Practice streak and problem bank",
    username: "ik337vgef",
    envUserKey: "GFG_USERNAME",
  },
  {
    platform: "github",
    label: PLATFORM_NAMES.github,
    color: PLATFORM_COLORS.github,
    description: "Repository activity and public footprint",
    username: process.env.GITHUB_USERNAME ?? "",
    token: process.env.GITHUB_TOKEN,
    envUserKey: "GITHUB_USERNAME",
    envTokenKey: "GITHUB_TOKEN",
  },
  {
    platform: "atcoder",
    label: PLATFORM_NAMES.atcoder,
    color: PLATFORM_COLORS.atcoder,
    description: "Optional future-ready contest support",
    username: "Imran_khan_87",
    envUserKey: "ATCODER_USERNAME",
  },
];

function serializeAnalytics(analytics: UnifiedAnalytics): SerializedAnalytics {
  return {
    ...analytics,
    lastUpdated: analytics.lastUpdated.toISOString(),
  };
}

function createSummary(platforms: SerializedAnalytics[], supportedCount: number): DashboardSummary {
  const totalProblems = platforms.reduce((sum, platform) => sum + platform.totalSolved, 0);
  const totalContests = platforms.reduce((sum, platform) => sum + platform.contests, 0);
  const streakValues = platforms.map((platform) => platform.activeStreak).filter((value) => value > 0);
  const avgStreak = streakValues.length > 0
    ? Math.round(streakValues.reduce((sum, value) => sum + value, 0) / streakValues.length)
    : 0;
  const maxStreak = platforms.reduce((max, platform) => Math.max(max, platform.maxStreak), 0);
  const topPlatform = platforms
    .slice()
    .sort((left, right) => right.totalSolved - left.totalSolved)[0] ?? null;

  return {
    totalProblems,
    totalContests,
    avgStreak,
    maxStreak,
    platformCount: platforms.length,
    supportedCount,
    completionRate: supportedCount === 0 ? 0 : Math.round((platforms.length / supportedCount) * 100),
    lastUpdated: new Date().toISOString(),
    topPlatform: topPlatform
      ? {
          platform: topPlatform.platform as AdapterType,
          label: PLATFORM_NAMES[topPlatform.platform] ?? topPlatform.platform,
          totalSolved: topPlatform.totalSolved,
          contests: topPlatform.contests,
          color: PLATFORM_COLORS[topPlatform.platform as keyof typeof PLATFORM_COLORS] ?? "#60a5fa",
        }
      : null,
  };
}

export function getAnalyticsAccounts(): AnalyticsAccountConfig[] {
  return platformAccounts.map((account) => ({
    platform: account.platform,
    username: account.username,
    token: account.token,
    label: account.label,
    color: account.color,
    description: account.description,
  }));
}

export async function buildAnalyticsDashboardData(): Promise<AnalyticsDashboardData> {
  const accounts = platformAccounts;

  const platformResults = await Promise.all(
    accounts.map(async (account) => {
      if (!account.username) {
        return {
          ...account,
          status: "missing" as const,
          analytics: {
            platform: account.platform,
            username: "",
            totalSolved: 0,
            activeStreak: 0,
            maxStreak: 0,
            contests: 0,
            badge: "Unavailable",
            rating: 0,
            ratingChange: 0,
            lastUpdated: new Date().toISOString(),
            profileUrl: undefined,
          },
        };
      }

      const analytics = await getAdapterStats(account.platform, account.username, account.token);

      if (!analytics) {
        return {
          ...account,
          status: "error" as const,
          analytics: null,
          error: `Unable to load ${account.label}`,
        };
      }

      return {
        ...account,
        status: "connected" as const,
        analytics: serializeAnalytics(analytics),
      };
    }),
  );

  const connectedPlatforms = platformResults
    .filter((platform) => platform.status === "connected" && platform.analytics !== null)
    .map((platform) => platform.analytics as SerializedAnalytics);

  const summary = createSummary(connectedPlatforms, accounts.length);

  return {
    generatedAt: new Date().toISOString(),
    summary,
    platforms: platformResults,
  };
}

export function getPlatformTone(platform: AdapterType | string): string {
  return PLATFORM_COLORS[platform as keyof typeof PLATFORM_COLORS] ?? "#60a5fa";
}
