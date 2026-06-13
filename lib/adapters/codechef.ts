import { UnifiedAnalytics } from "@/lib/types/analytics";
import { fallbackAnalytics } from "./fallback";

function extractNumber(text: string, pattern: RegExp): number {
  const match = text.match(pattern);
  return match?.[1] ? Number.parseInt(match[1], 10) : 0;
}

function extractText(text: string, pattern: RegExp): string | undefined {
  const match = text.match(pattern);
  return match?.[1]?.trim() || undefined;
}

export async function getCodeChefStats(username: string): Promise<UnifiedAnalytics> {
  try {
    const response = await fetch(`https://www.codechef.com/users/${username}`, {
      cache: "no-store",
      headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Referer: "https://www.codechef.com/",
      },
    });

    if (!response.ok) {
      return fallbackAnalytics("codechef", username, `https://www.codechef.com/users/${username}`);
    }

    const html = await response.text();
    const normalized = html.replace(/\s+/g, " ");
    const totalSolved = extractNumber(normalized, /Total Problems Solved:\s*(\d+)/i);
    const contests = extractNumber(normalized, /Contests\s*\((\d+)\)/i);
    const badge = extractText(normalized, /(Problem Solver\s*-[^<]+Badge|Bronze League|Silver League|Gold League|Diamond League)/i);
    console.log("Platform response:", { platform: "codechef", username, totalSolved, contests, hasBadge: Boolean(badge) });

    return {
      platform: "codechef",
      username,
      totalSolved,
      activeStreak: 0,
      maxStreak: 0,
      contests,
      rating: 0,
      badge,
      lastUpdated: new Date(),
      profileUrl: `https://www.codechef.com/users/${username}`,
    };
  } catch (error) {
    console.error("Adapter failed:", { platform: "codechef", error });
    return fallbackAnalytics("codechef", username, `https://www.codechef.com/users/${username}`);
  }
}
