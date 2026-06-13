export interface UnifiedAnalytics {
  platform: string;
  username: string;
  totalSolved: number;
  activeStreak: number;
  maxStreak: number;
  contests: number;
  badge?: string;
  rating?: number;
  ratingChange?: number;
  lastUpdated: Date;
  profileUrl?: string;
  rank?: number;
  maxRating?: number;
  // GitHub-specific optional fields
  followers?: number;
  following?: number;
  stars?: number;
  languages?: Record<string, number>;
  publicRepos?: number;
  totalCommits?: number;
  contributions?: number;
}

export interface PlatformAnalytics {
  [key: string]: UnifiedAnalytics;
}

export interface AggregatedAnalytics {
  totalProblems: number;
  totalContests: number;
  avgStreak: number;
  maxStreak: number;
  platformCount: number;
  platforms: UnifiedAnalytics[];
  lastUpdated: Date;
}

export interface CodeChartData {
  date: string;
  problems: number;
  contests: number;
}

export interface PlatformDistribution {
  name: string;
  value: number;
  color: string;
}

export interface RatingComparison {
  platform: string;
  rating: number;
  maxRating?: number;
  color: string;
}
