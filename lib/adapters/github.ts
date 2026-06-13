import { UnifiedAnalytics } from "@/lib/types/analytics";
import { createFallbackAnalytics } from "./fallback";

interface GitHubGraphQLResponse {
  data?: {
    user?: {
      login: string;
      followers: { totalCount: number };
      following: { totalCount: number };
      repositories: {
        totalCount: number;
        nodes: Array<{
          stargazerCount: number;
          languages: {
            nodes: Array<{ name: string }>;
          };
          defaultBranchRef?: {
            target?: {
              history?: {
                totalCount: number;
              };
            };
          };
        }>;
      };
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: Array<{
            contributionDays: Array<{
              contributionCount: number;
            }>;
          }>;
        };
      };
    };
  };
}

type GitHubContributionWeek = NonNullable<
  NonNullable<GitHubGraphQLResponse["data"]>["user"]
>["contributionsCollection"]["contributionCalendar"]["weeks"][number];

function calculateStreak(weeks: GitHubContributionWeek[]): number {
  const days = weeks.flatMap((week) => week.contributionDays);
  let streak = 0;

  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].contributionCount > 0) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export async function getGitHubStats(
  username: string
): Promise<UnifiedAnalytics> {
  try {
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      const fb = createFallbackAnalytics("github", username);
      fb.badge = "Missing GitHub token";
      return fb;
    }

    const query = `
      query($login: String!) {
        user(login: $login) {
          login

          followers {
            totalCount
          }

          following {
            totalCount
          }

          repositories(
            first: 100
            ownerAffiliations: OWNER
            privacy: PUBLIC
            isFork: false
          ) {
            totalCount
            nodes {
              stargazerCount

              languages(first: 10) {
                nodes {
                  name
                }
              }

              defaultBranchRef {
                target {
                  ... on Commit {
                    history {
                      totalCount
                    }
                  }
                }
              }
            }
          }

          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      next: { revalidate: 300 },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: {
          login: username,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API ${response.status}`);
    }

    const data =
      (await response.json()) as GitHubGraphQLResponse;

    const user = data.data?.user;

    if (!user) {
      return createFallbackAnalytics("github", username);
    }

    let stars = 0;
    let commits = 0;
    const languages: Record<string, number> = {};

    user.repositories.nodes.forEach((repo) => {
      stars += repo.stargazerCount ?? 0;
      commits +=
        repo.defaultBranchRef?.target?.history?.totalCount ?? 0;

      repo.languages.nodes.forEach((lang) => {
        languages[lang.name] =
          (languages[lang.name] ?? 0) + 1;
      });
    });

    const contributions =
      user.contributionsCollection.contributionCalendar
        .totalContributions;

    const streak = calculateStreak(
      user.contributionsCollection.contributionCalendar.weeks
    );

    return {
      platform: "github",
      username: user.login,
      totalSolved: user.repositories.totalCount,
      activeStreak: streak,
      maxStreak: streak,
      contests: 0,
      rating: 0,
      rank: 0,
      followers: user.followers.totalCount,
      following: user.following.totalCount,
      stars,
      totalCommits: commits,
      contributions,
      languages,
      badge: `${stars} stars`,
      profileUrl: `https://github.com/${username}`,
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error("GitHub adapter failed:", error);
    return createFallbackAnalytics("github", username);
  }
}
