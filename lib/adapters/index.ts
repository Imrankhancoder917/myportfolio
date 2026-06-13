import { UnifiedAnalytics, AggregatedAnalytics } from "@/lib/types/analytics";
import { getLeetCodeStats } from "./leetcode";
import { getCodeforcesStats } from "./codeforces";
import { getGitHubStats } from "./github";
import { getCodeChefStats } from "./codechef";
import { getHackerRankStats } from "./hackerrank";
import { getGFGStats } from "./gfg";
import { getAtCoderStats } from "./atcoder";
import { fallbackAnalytics } from "./fallback";

export type AdapterType = "leetcode" | "codeforces" | "github" | "codechef" | "hackerrank" | "gfg" | "atcoder";

type AdapterFunction = (username: string, token?: string) => Promise<UnifiedAnalytics>;

const adapters: Record<AdapterType, AdapterFunction> = {
  leetcode: getLeetCodeStats,
  codeforces: getCodeforcesStats,
  github: getGitHubStats,
  codechef: getCodeChefStats,
  hackerrank: getHackerRankStats,
  gfg: getGFGStats,
  atcoder: getAtCoderStats,
};

export interface PlatformConfig {
  platform: AdapterType;
  username: string;
  token?: string;
}

export async function getAdapterStats(
  platform: AdapterType,
  username: string,
  token?: string,
): Promise<UnifiedAnalytics> {
  try {
    const adapter = adapters[platform];
    if (!adapter) {
      console.error(`No adapter found for platform: ${platform}`);
      return fallbackAnalytics(platform, username);
    }
    const analytics = await adapter(username, token);
    console.log("Platform response:", { platform, username, totalSolved: analytics.totalSolved, contests: analytics.contests });
    return analytics;
  } catch (error) {
    console.error("Adapter failed:", { platform, error });
    return fallbackAnalytics(platform, username);
  }
}

export async function aggregateAnalytics(
  configs: PlatformConfig[],
): Promise<AggregatedAnalytics> {
  const results = await Promise.allSettled(
    configs.map((config) =>
      getAdapterStats(config.platform, config.username, config.token),
    ),
  );

  const platforms = results
    .map((result) => (result.status === "fulfilled" ? result.value : null))
    .filter((stat): stat is UnifiedAnalytics => stat !== null);

  const totalProblems = platforms.reduce((sum, p) => sum + p.totalSolved, 0);
  const totalContests = platforms.reduce((sum, p) => sum + p.contests, 0);
  const streaks = platforms.map((p) => p.activeStreak).filter((s) => s > 0);
  const avgStreak = streaks.length > 0 ? Math.round(streaks.reduce((a, b) => a + b) / streaks.length) : 0;
  const maxStreak = Math.max(...platforms.map((p) => p.maxStreak), 0);

  return {
    totalProblems,
    totalContests,
    avgStreak,
    maxStreak,
    platformCount: platforms.length,
    platforms,
    lastUpdated: new Date(),
  };
}

export { getLeetCodeStats, getCodeforcesStats, getGitHubStats, getCodeChefStats, getHackerRankStats, getGFGStats, getAtCoderStats };
