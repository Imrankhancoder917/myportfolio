import { UnifiedAnalytics } from "@/lib/types/analytics";
import { fallbackAnalytics } from "./fallback";

interface LeetCodeResponse {
  data?: {
    matchedUser?: {
      username: string;
      profile?: {
        ranking?: number;
        userAvatar?: string;
        realName?: string;
      };
      submitStats?: {
        acSubmissionNum: Array<{
          difficulty: string;
          count: number;
        }>;
      };
      userCalendar?: {
        streak?: number;
        totalActiveDays?: number;
      };
      contestBadge?: {
        name?: string;
      } | null;
    } | null;
    userContestRanking?: {
      attendedContestsCount?: number;
      rating?: number;
      globalRanking?: number;
    } | null;
  };
  errors?: Array<{
    message?: string;
  }>;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function browserHeaders(): Record<string, string> {
  return {
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Cache-Control": "no-cache",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    Referer: "https://leetcode.com/",
    Origin: "https://leetcode.com",
  };
}

async function fetchGraphQLProfile(
  username: string
): Promise<LeetCodeResponse | null> {
  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username

        profile {
          ranking
          userAvatar
          realName
        }

        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }

        userCalendar {
          streak
          totalActiveDays
        }

        contestBadge {
          name
        }
      }

      userContestRanking(username: $username) {
        attendedContestsCount
        rating
        globalRanking
      }
    }
  `;

  for (let attempt = 1; attempt <= 3; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const homepageResponse = await fetch("https://leetcode.com/", {
        headers: browserHeaders(),
        cache: "no-store",
        signal: controller.signal,
      });

      const cookieHeader = homepageResponse.headers.get("set-cookie") ?? "";
      const csrfToken = cookieHeader.match(/csrftoken=([^;]+)/)?.[1];

      const response = await fetch("https://leetcode.com/graphql/", {
        method: "POST",
        headers: {
          ...browserHeaders(),
          "Content-Type": "application/json",
          ...(csrfToken
            ? {
                "x-csrftoken": csrfToken,
                Cookie: `csrftoken=${csrfToken}`,
              }
            : {}),
        },
        body: JSON.stringify({
          operationName: "getUserProfile",
          query,
          variables: {
            username,
          },
        }),
        cache: "no-store",
        signal: controller.signal,
      });

      const data = (await response.json()) as LeetCodeResponse;

      console.log("LeetCode response:", data);

      if (
        response.ok &&
        !data.errors?.length &&
        data?.data?.matchedUser
      ) {
        clearTimeout(timeoutId);
        return data;
      }

      if (attempt < 3) {
        await sleep(500 * attempt);
      }
    } catch (error) {
      console.error("LeetCode adapter failed:", error);

      if (attempt < 3) {
        await sleep(500 * attempt);
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return null;
}

export async function getLeetCodeStats(
  username: string
): Promise<UnifiedAnalytics> {
  const attempts = [
    username,
    username.trim(),
    username.toLowerCase(),
  ];

  for (const candidateUsername of attempts) {
    const data = await fetchGraphQLProfile(candidateUsername);

    if (!data?.data?.matchedUser) {
      continue;
    }

    const user = data.data.matchedUser;
    const contestRanking = data.data.userContestRanking;

    const allStats = user.submitStats?.acSubmissionNum ?? [];

    console.log("LeetCode stats:", allStats);

    const totalSolved =
      allStats.find(
        (item) => item.difficulty === "All"
      )?.count ?? 0;

    return {
      platform: "leetcode",
      username: user.username,
      totalSolved,
      activeStreak: user.userCalendar?.streak ?? 0,
      maxStreak: user.userCalendar?.streak ?? 0,
      contests: contestRanking?.attendedContestsCount ?? 0,
      rating: contestRanking?.rating ?? 0,
      badge: user.contestBadge?.name ?? "LeetCode",
      rank: contestRanking?.globalRanking ?? user.profile?.ranking ?? 0,
      profileUrl: `https://leetcode.com/u/${user.username}/`,
      lastUpdated: new Date(),
    };
  }

  return fallbackAnalytics(
    "leetcode",
    username,
    `https://leetcode.com/u/${username}/`
  );
}