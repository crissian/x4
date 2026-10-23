import type { AchievementCategory, AchievementRow, AchievementUnlock, StatAchievement } from './achievement-model';

/** What the achievements page shows. */
export interface AchievementCriteria {
	/** lower case part of the title or note */
	search: string;
	/** a category, or empty for all */
	category: AchievementCategory | '';
	/** a content pack version, or -1 for all */
	version: number;
	hideDone: boolean;
	done: Readonly<Record<string, boolean>>;
}

/** The achievements of one content pack, with how many are done. */
export interface AchievementGroup {
	version: number;
	rows: AchievementRow[];
	done: number;
}

/** Builds, filters and groups the achievement rows. */
export class AchievementRows {
	/** The `GAME_VERSIONS` index of Timelines. */
	static readonly TIMELINES = 5;

	static readonly CATEGORIES: readonly AchievementCategory[] = [
		'story',
		'mission',
		'terraforming',
		'general',
		'statistic',
		'tutorial',
		'scenario',
	];

	static categoryLabel(category: AchievementCategory): string {
		switch (category) {
			case 'story':
				return $localize`:achievement category:Story`;
			case 'mission':
				return $localize`:achievement category:Missions`;
			case 'terraforming':
				return $localize`:achievement category:Terraforming`;
			case 'general':
				return $localize`:achievement category:General`;
			case 'statistic':
				return $localize`:achievement category:Statistics`;
			case 'tutorial':
				return $localize`:achievement category:Tutorials`;
			case 'scenario':
				return $localize`:achievement category:Timelines scenarios`;
		}
	}

	static isCategory(value: string): value is AchievementCategory {
		return (AchievementRows.CATEGORIES as readonly string[]).includes(value);
	}

	static build(unlocks: readonly AchievementUnlock[], stats: readonly StatAchievement[]): AchievementRow[] {
		return [...unlocks.map((x) => AchievementRows.unlock(x)), ...stats.map((x) => AchievementRows.stat(x))];
	}

	static unlock(value: AchievementUnlock): AchievementRow {
		const cues = value.cues?.length ? `${value.cues.join(', ')} - ` : '';
		return {
			key: value.id,
			title: value.id,
			note: value.comment,
			source: `${cues}${value.scripts.join(', ')}`,
			version: value.version,
			category: value.category,
			spoiler: value.category === 'story',
		};
	}

	/** A statistic achievement: the base game's, Timelines' for the scenario ones. */
	static stat(value: StatAchievement): AchievementRow {
		const name = value.name ?? value.id;
		const target = value.rank ?? `${value.unlock.toLocaleString()}${value.units === 'credits' ? ' Cr' : ''}`;
		return {
			key: `${value.id}:${value.unlock}`,
			title: $localize`:statistic achievement:${name}:name: reaches ${target}:target:`,
			note: value.progressStep
				? $localize`Account wide statistic, progress shown every ${value.progressStep.toLocaleString()}:step:`
				: $localize`Account wide statistic`,
			source: value.id,
			// the scenario statistics count for Timelines achievements
			version: value.scenario ? AchievementRows.TIMELINES : 0,
			category: 'statistic',
			spoiler: false,
		};
	}

	static filter(rows: readonly AchievementRow[], criteria: AchievementCriteria): AchievementRow[] {
		return rows.filter(
			(x) =>
				(!criteria.category || x.category === criteria.category) &&
				(criteria.version < 0 || x.version === criteria.version) &&
				(!criteria.hideDone || !criteria.done[x.key]) &&
				(!criteria.search || AchievementRows.text(x).includes(criteria.search))
		);
	}

	/** The rows by content pack in version order, categories in `CATEGORIES` order inside. */
	static group(rows: readonly AchievementRow[], done: Readonly<Record<string, boolean>>): AchievementGroup[] {
		const groups = new Map<number, AchievementRow[]>();
		for (const row of rows) {
			groups.set(row.version, [...(groups.get(row.version) ?? []), row]);
		}
		return [...groups.entries()]
			.sort(([a], [b]) => a - b)
			.map(([version, list]) => ({
				version,
				rows: [...list].sort(
					(a, b) =>
						AchievementRows.CATEGORIES.indexOf(a.category) -
							AchievementRows.CATEGORIES.indexOf(b.category) ||
						a.title.localeCompare(b.title, undefined, { numeric: true })
				),
				done: list.filter((x) => done[x.key]).length,
			}));
	}

	private static text(row: AchievementRow): string {
		return `${row.title}\n${row.note ?? ''}`.toLowerCase();
	}
}
