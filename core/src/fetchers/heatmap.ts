import type { GitHubClient } from "../lib/github.ts";
import type { ContributionData, ContributionDay } from "../types/index.ts";

const HEATMAP_QUERY = `
query contributionCalendar($username: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $username) {
    login
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            weekday
          }
        }
      }
    }
  }
}
`;

interface HeatmapResponse {
	user: {
		login: string;
		contributionsCollection: {
			contributionCalendar: {
				totalContributions: number;
				weeks: {
					contributionDays: {
						date: string;
						contributionCount: number;
						weekday: number;
					}[];
				}[];
			};
		};
	};
}

function calculateLevel(count: number, maxCount: number): 0 | 1 | 2 | 3 | 4 {
	if (count === 0) return 0;
	if (maxCount === 0) return 0;
	const ratio = count / maxCount;
	if (ratio <= 0.25) return 1;
	if (ratio <= 0.5) return 2;
	if (ratio <= 0.75) return 3;
	return 4;
}

function calculateStreaks(days: ContributionDay[]): {
	currentStreak: number;
	longestStreak: number;
} {
	const sortedDays = [...days].sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
	);

	let currentStreak = 0;
	let longestStreak = 0;
	let tempStreak = 0;

	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);

	for (const [i, day] of sortedDays.entries()) {
		const dayDate = new Date(day.date);
		dayDate.setHours(0, 0, 0, 0);

		const isToday = dayDate.getTime() === today.getTime();
		const isYesterday = dayDate.getTime() === yesterday.getTime();

		if (isToday || isYesterday) {
			if (day.contributionCount > 0) {
				currentStreak = 1;

				let lastDate = new Date(day.date);
				for (let j = i + 1; j < sortedDays.length; j++) {
					const prevDay = sortedDays[j];
					if (!prevDay) break;

					const expectedDate = new Date(lastDate);
					expectedDate.setDate(expectedDate.getDate() - 1);

					const prevDayDate = new Date(prevDay.date);
					if (
						prevDayDate.getTime() === expectedDate.getTime() &&
						prevDay.contributionCount > 0
					) {
						currentStreak++;
						lastDate = new Date(prevDay.date);
					} else {
						break;
					}
				}
				break;
			}
		} else if (dayDate.getTime() < yesterday.getTime()) {
			break;
		}
	}

	const chronologicalDays = [...days].sort(
		(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
	);

	for (const day of chronologicalDays) {
		if (day.contributionCount > 0) {
			tempStreak++;
			longestStreak = Math.max(longestStreak, tempStreak);
		} else {
			tempStreak = 0;
		}
	}

	return { currentStreak, longestStreak };
}

export async function fetchContributionData(
	client: GitHubClient,
	username: string,
	timeRange = 365,
): Promise<ContributionData> {
	const to = new Date();
	const from = new Date();
	from.setDate(from.getDate() - (timeRange - 1));

	const data = await client.graphql<HeatmapResponse>(HEATMAP_QUERY, {
		username,
		from: from.toISOString(),
		to: to.toISOString(),
	});

	const rawWeeks = data.user.contributionsCollection.contributionCalendar.weeks;
	const allDays = rawWeeks.flatMap((week) => week.contributionDays);
	const maxCount = Math.max(...allDays.map((d) => d.contributionCount), 1);

	const weeks = rawWeeks.map((week) => ({
		contributionDays: week.contributionDays.map((day) => ({
			...day,
			level: calculateLevel(day.contributionCount, maxCount),
		})),
	}));

	const flatDays = weeks.flatMap((w) => w.contributionDays);
	const { currentStreak, longestStreak } = calculateStreaks(flatDays);

	return {
		username: data.user.login,
		totalContributions:
			data.user.contributionsCollection.contributionCalendar.totalContributions,
		currentStreak,
		longestStreak,
		weeks,
	};
}
