import { UnifiedAnalytics } from "@/lib/types/analytics";
import { fallbackAnalytics } from "./fallback";

interface CodeforcesUser {
  handle: string;
  rating?: number;
  maxRating?: number;
  rank?: string;
}

interface CodeforcesRatingEntry {
  contestId: number;
  contestName: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
}

interface CodeforcesSubmission {
  problem: {
    contestId?: number;
    index?: string;
    name: string;
  };
  verdict?: string;
  creationTimeSeconds?: number;
}

interface CodeforcesApiResponse<T> {
  status: string;
  result: T;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isOkResponse<T>(
  payload: CodeforcesApiResponse<T> | null
): payload is CodeforcesApiResponse<T> {
  return Boolean(
    payload &&
      typeof payload.status === "string" &&
      payload.status.toUpperCase() === "OK"
  );
}

function mapRankToScore(rank?: string): number {
  const order: Record<string, number> = {
    newbie: 1,
    pupil: 2,
    specialist: 3,
    expert: 4,
    "candidate master": 5,
    master: 6,
    "international master": 7,
    grandmaster: 8,
    "international grandmaster": 9,
    "legendary grandmaster": 10,
  };

  return rank ? order[rank.toLowerCase()] ?? 0 : 0;
}

async function fetchJsonWithRetry<T>(
  url: string,
  attempts = 3
): Promise<CodeforcesApiResponse<T> | null> {
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
          Referer: "https://codeforces.com/",
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = (await response.json()) as CodeforcesApiResponse<T>;

      console.log("Codeforces API response:", data);

      clearTimeout(timeoutId);
      return data;
    } catch (error) {
      console.error(`Codeforces attempt ${attempt} failed:`, error);

      if (attempt < attempts) {
        await sleep(500 * attempt);
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return null;
}

export async function getCodeforcesStats(
  handle: string
): Promise<UnifiedAnalytics> {
  try {
    const [userData, ratingData, submissionsData] = await Promise.all([
      fetchJsonWithRetry<CodeforcesUser[]>(
        `https://codeforces.com/api/user.info?handles=${handle}`
      ),
      fetchJsonWithRetry<CodeforcesRatingEntry[]>(
        `https://codeforces.com/api/user.rating?handle=${handle}`
      ),
      fetchJsonWithRetry<CodeforcesSubmission[]>(
        `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=5000`
      ),
    ]);

    console.log("Codeforces userData:", userData);
    console.log("Codeforces ratingData:", ratingData);
    console.log("Codeforces submissionsData:", submissionsData);

    if (
      !isOkResponse(userData) ||
      !Array.isArray(userData.result) ||
      userData.result.length === 0
    ) {
      return fallbackAnalytics(
        "codeforces",
        handle,
        `https://codeforces.com/profile/${handle}`
      );
    }

    const user = userData.result[0];

    const contestHistory = isOkResponse(ratingData)
      ? ratingData.result
      : [];

    const submissions = isOkResponse(submissionsData)
      ? submissionsData.result
      : [];

    const solvedSet = new Set<string>();

    submissions.forEach((submission) => {
      if (submission.verdict === "OK") {
        const contestId = submission.problem.contestId ?? 0;
        const index =
          submission.problem.index ?? submission.problem.name;

        solvedSet.add(`${contestId}-${index}`);
      }
    });

    const latestContest =
      contestHistory.length > 0
        ? contestHistory[contestHistory.length - 1]
        : null;

    return {
      platform: "codeforces",
      username: user.handle,
      totalSolved: solvedSet.size,
      activeStreak: 0,
      maxStreak: 0,
      contests: contestHistory.length,
      rating: user.rating ?? 0,
      maxRating: user.maxRating ?? 0,
      rank: mapRankToScore(user.rank),
      ratingChange: latestContest
        ? latestContest.newRating - latestContest.oldRating
        : 0,
      badge: user.rank ?? "Codeforces",
      profileUrl: `https://codeforces.com/profile/${handle}`,
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error("Codeforces adapter failed:", error);

    return fallbackAnalytics(
      "codeforces",
      handle,
      `https://codeforces.com/profile/${handle}`
    );
  }
}