import { UnifiedAnalytics } from "@/lib/types/analytics";
import { fallbackAnalytics } from "./fallback";

interface HackerRankBadge {
  name: string;
  stars?: number;
}

// HackerRank responses are loosely typed; handle as unknown and narrow at runtime

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(
  url: string,
  attempts = 3
): Promise<unknown | null> {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(url, {
        next: { revalidate: 300 },
        headers: {
          Accept: "application/json",
          "Accept-Language": "en-US,en;q=0.9",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
          Referer: "https://www.hackerrank.com/",
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

        const data = await response.json();

        console.log("HackerRank response:", data);

        clearTimeout(timeoutId);
        return data as unknown;
    } catch (error) {
      console.error(`HackerRank attempt ${attempt} failed:`, error);

      if (attempt < attempts) {
        await sleep(500 * attempt);
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return null;
}

export async function getHackerRankStats(
  username: string
): Promise<UnifiedAnalytics> {
  try {
    const [badgeData, profilePage] = await Promise.all([
      fetchWithRetry(
        `https://www.hackerrank.com/rest/hackers/${username}/badges`
      ),
      fetch(`https://www.hackerrank.com/profile/${username}`, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        },
        next: { revalidate: 300 },
      }).then((res) => res.text()),
    ]);

    // Narrow unknown response
    let badges: HackerRankBadge[] = [];
    if (Array.isArray(badgeData)) {
      badges = badgeData as HackerRankBadge[];
    } else if (badgeData && typeof badgeData === "object") {
      const bd = badgeData as Record<string, unknown>;
      const maybeBadges = bd.badges ?? bd.models;
      if (Array.isArray(maybeBadges)) {
        badges = maybeBadges as HackerRankBadge[];
      }
    }

    // Prefer the structured badges/models response which may include solved counts
    let totalSolved = 0;

    const problemBadge = badges.find((b) => {
      const rb = b as unknown as Record<string, unknown>;
      const bt = rb.badge_type ?? rb.badge_name;
      return typeof bt === "string" && bt.toLowerCase().includes("problem");
    });

    if (problemBadge) {
      const rb = problemBadge as unknown as Record<string, unknown>;
      if (typeof rb.solved === "number") {
        totalSolved = rb.solved as number;
      }
    } else {
      const solvedMatch = profilePage.match(/(\d+)\s*Problem Solving/i);
      if (solvedMatch) {
        totalSolved = parseInt(solvedMatch[1], 10);
      }
    }

    return {
      platform: "hackerrank",
      username,
      totalSolved,
      activeStreak: 0,
      maxStreak: 0,
      contests: 0,
      rating: 0,
      rank: 0,
      badge:
        badges.length > 0
          ? `${badges.length} badges`
          : "HackerRank",
      lastUpdated: new Date(),
      profileUrl: `https://www.hackerrank.com/profile/${username}`,
    };
  } catch (error) {
    console.error("HackerRank adapter failed:", error);

    return fallbackAnalytics(
      "hackerrank",
      username,
      `https://www.hackerrank.com/profile/${username}`
    );
  }
}