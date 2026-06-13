import type { UnifiedAnalytics } from "@/lib/types/analytics";
import type { AdapterType } from "./index";

export function fallbackAnalytics(
  platform: AdapterType,
  username: string,
  profileUrl?: string,
): UnifiedAnalytics {
  const profileUrls: Record<AdapterType, string> = {
    leetcode: `https://leetcode.com/u/${username}/`,
    codeforces: `https://codeforces.com/profile/${username}`,
    github: `https://github.com/${username}`,
    codechef: `https://www.codechef.com/users/${username}`,
    hackerrank: `https://www.hackerrank.com/${username}`,
    gfg: `https://www.geeksforgeeks.org/profile/${username}?tab=activity`,
    atcoder: `https://atcoder.jp/users/${username}`,
  };

  const normalizedProfileUrl = profileUrl && /^https?:\/\//i.test(profileUrl)
    ? profileUrl
    : profileUrls[platform];

  return {
    platform,
    username,
    totalSolved: 0,
    activeStreak: 0,
    maxStreak: 0,
    contests: 0,
    rating: 0,
    ratingChange: 0,
    rank: 0,
    lastUpdated: new Date(),
    profileUrl: normalizedProfileUrl,
    badge: "Unavailable",
  };
}

export { fallbackAnalytics as createFallbackAnalytics };