import { NextResponse } from "next/server";
import { buildAnalyticsDashboardData } from "@/lib/analytics/dashboard";
import { cacheService } from "@/lib/services/cache";
import { CACHE_TTL } from "@/lib/constants/config";

export const dynamic = "force-dynamic";
const ANALYTICS_CACHE_KEY = "analytics:dashboard";

export async function GET() {
  try {
    const cached = cacheService.get(ANALYTICS_CACHE_KEY);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      });
    }

    const data = await buildAnalyticsDashboardData();
    cacheService.set(ANALYTICS_CACHE_KEY, data, CACHE_TTL.analytics);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Analytics API Error:", error);
    return NextResponse.json(
      {
        generatedAt: new Date().toISOString(),
        summary: {
          totalProblems: 0,
          totalContests: 0,
          avgStreak: 0,
          maxStreak: 0,
          platformCount: 0,
          supportedCount: 0,
          completionRate: 0,
          lastUpdated: new Date().toISOString(),
          topPlatform: null,
        },
        platforms: [],
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  }
}
