import { UnifiedAnalytics } from "@/lib/types/analytics";
import { fallbackAnalytics } from "./fallback";

function extractNumber(text: string, pattern: RegExp): number {
  const match = text.match(pattern);
  return match?.[1] ? Number.parseInt(match[1], 10) : 0;
}

function extractByKey(text: string, key: string): number {
  // Permissive key matcher: tolerates optional escaped quotes and intervening chars
  const re = new RegExp(key + "\\D*(\\d+)", "i");
  const match = text.match(re);
  return match?.[1] ? Number.parseInt(match[1], 10) : 0;
}

async function fetchTextWithTimeout(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Referer: "https://www.geeksforgeeks.org/",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      return "";
    }

    return await response.text();
  } finally {
    clearTimeout(timer);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getGFGStats(username: string): Promise<UnifiedAnalytics> {
  try {
    let html = "";

    for (let attempt = 1; attempt <= 3; attempt += 1) {
      html = await fetchTextWithTimeout(`https://www.geeksforgeeks.org/profile/${username}?tab=activity`);
      if (html) {
        break;
      }

      if (attempt < 3) {
        await sleep(250 * 2 ** (attempt - 1));
      }
    }

    if (!html) {
      return fallbackAnalytics("gfg", username, `https://www.geeksforgeeks.org/profile/${username}`);
    }

    const normalized = html.replace(/\s+/g, " ");

    // Primary human-readable patterns
    let totalSolved = extractNumber(normalized, /(\d+)\s*Problems Solved/i);
    let rating = extractNumber(normalized, /Coding Score\s*(\d+)/i);
    let maxStreak = extractNumber(normalized, /Longest Streak:\s*(\d+)\s*Days/i);
    let currentStreak = extractNumber(normalized, /(\d+)\s*Day POTD Streak/i);
    let instituteRank = extractNumber(normalized, /Institute Rank\s*(\d+)/i);
      const articlesPublished = extractNumber(normalized, /Articles Published\s*(\d+)/i);
    let potdSolved = extractNumber(normalized, /POTDs Solved:\s*(\d+)/i);

    // Fallbacks: some profiles embed a JSON blob with keys like score, total_problems_solved
    const unescaped = normalized.replace(/\\"/g, '"').replace(/\\u0022/g, '"');

    // Quick raw-HTML numeric pickup for robust cases (if embedded JSON present)
    const rawTotalMatch = html.match(/total_problems_solved\D*(\d+)/i) || html.match(/"total_problems_solved"\D*(\d+)/i);
    if (rawTotalMatch && rawTotalMatch[1]) {
      const quickTotal = Number.parseInt(rawTotalMatch[1], 10);
      if (quickTotal > 0) {
        console.log('GFG quick-extract total:', quickTotal);
        return {
          platform: 'gfg',
          username,
          totalSolved: quickTotal,
          activeStreak: 0,
          maxStreak: 0,
          contests: 0,
          badge: undefined,
          rating: 0,
          lastUpdated: new Date(),
          profileUrl: `https://www.geeksforgeeks.org/profile/${username}?tab=activity`,
        };
      }
    }

    if (!totalSolved) {
      totalSolved = extractNumber(unescaped, /"total_problems_solved"\s*:\s*(\d+)/i) || extractByKey(unescaped, "total_problems_solved");
    }
    if (!rating) {
      rating = extractNumber(unescaped, /"score"\s*:\s*(\d+)/i) || extractByKey(unescaped, "score");
    }
    if (!instituteRank) {
      instituteRank = extractNumber(unescaped, /"institute_rank"\s*:\s*(\d+)/i) || extractByKey(unescaped, "institute_rank");
    }
    if (!potdSolved) {
      potdSolved = extractNumber(unescaped, /"pod_solved_total"\s*:\s*(\d+)/i) || extractNumber(unescaped, /"total_problems_solved"\s*:\s*(\d+)/i) || extractByKey(unescaped, "pod_solved_total") || extractByKey(unescaped, "total_problems_solved");
    }
    if (!currentStreak) {
      currentStreak = extractNumber(unescaped, /"pod_solved_current_streak"\s*:\s*(\d+)/i) || extractByKey(unescaped, "pod_solved_current_streak");
    }
    if (!maxStreak) {
      maxStreak = extractNumber(unescaped, /"pod_solved_global_longest_streak"\s*:\s*(\d+)/i) || extractNumber(unescaped, /"pod_solved_longest_streak"\s*:\s*(\d+)/i) || extractByKey(unescaped, "pod_solved_global_longest_streak") || extractByKey(unescaped, "pod_solved_longest_streak");
    }
    // Final raw-HTML fallbacks (cover cases where JSON is embedded in different escaping)
    if (!totalSolved) totalSolved = extractByKey(html, "total_problems_solved");
    if (!rating) rating = extractByKey(html, "score");
    if (!instituteRank) instituteRank = extractByKey(html, "institute_rank");
    if (!potdSolved) potdSolved = extractByKey(html, "pod_solved_total") || extractByKey(html, "total_problems_solved");
    if (!currentStreak) currentStreak = extractByKey(html, "pod_solved_current_streak");
    if (!maxStreak) maxStreak = extractByKey(html, "pod_solved_global_longest_streak") || extractByKey(html, "pod_solved_longest_streak");
    console.log("GFG response:", html);
    console.log("GFG extracted:", { totalSolved, rating, instituteRank, articlesPublished, potdSolved, currentStreak, maxStreak });

    if (html.includes("Access denied") || html.includes("Please sign in") || html.includes("blocked")) {
      return fallbackAnalytics("gfg", username, `https://www.geeksforgeeks.org/profile/${username}`);
    }

    return {
      platform: "gfg",
      username,
      totalSolved: totalSolved || potdSolved,
      activeStreak: currentStreak,
      maxStreak,
      contests: 0,
      badge: instituteRank
        ? `Institute Rank: ${instituteRank}`
        : articlesPublished > 0
          ? `${articlesPublished} Articles Published`
          : undefined,
      rating,
      lastUpdated: new Date(),
      profileUrl: `https://www.geeksforgeeks.org/profile/${username}?tab=activity`,
    };
  } catch (error) {
    console.error("Adapter failed:", error);
    return fallbackAnalytics("gfg", username, `https://www.geeksforgeeks.org/profile/${username}?tab=activity`);
  }
}
