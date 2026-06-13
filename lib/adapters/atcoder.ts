import { UnifiedAnalytics } from "@/lib/types/analytics";
import { fallbackAnalytics } from "./fallback";

interface AtCoderUserInfo {
  user_id: string;
  accepted_count: number;
  accepted_count_rank?: number;
  rated_point_sum?: number;
  rated_point_sum_rank?: number;
}

export async function getAtCoderStats(username: string): Promise<UnifiedAnalytics> {
  try {
    const [profileResponse, apiResponse] = await Promise.all([
      fetch(`https://atcoder.jp/users/${username}`, {
        cache: "no-store",
        headers: {
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
          Referer: "https://atcoder.jp/",
        },
      }),
      fetch(`https://kenkoooo.com/atcoder/atcoder-api/v3/user_info?user=${username}`, { cache: "no-store" }),
    ]);

    if (!profileResponse.ok || !apiResponse.ok) {
      return fallbackAnalytics("atcoder", username, `https://atcoder.jp/users/${username}`);
    }

    const data = (await apiResponse.json()) as AtCoderUserInfo;
    console.log("Platform response:", { platform: "atcoder", username, acceptedCount: data.accepted_count });

    return {
      platform: "atcoder",
      username: data.user_id || username,
      totalSolved: data.accepted_count || 0,
      activeStreak: 0,
      maxStreak: 0,
      contests: 0,
      rating: data.rated_point_sum || 0,
      rank: data.accepted_count_rank,
      lastUpdated: new Date(),
      profileUrl: `https://atcoder.jp/users/${username}`,
      badge: data.accepted_count_rank ? `AC Rank: ${data.accepted_count_rank}` : undefined,
    };
  } catch (error) {
    console.error("Adapter failed:", { platform: "atcoder", error });
    return fallbackAnalytics("atcoder", username, `https://atcoder.jp/users/${username}`);
  }
}
