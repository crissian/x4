import { Injectable, computed, inject, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';
import { QueryParamSync } from '../core/router/query-param-sync';
import { LocalStorage } from '../core/services/local-storage';
import { Achievements } from '../shared/services/data/achievements-data';
import { GAME_VERSIONS } from '../shared/services/constants';
import type { AchievementUnlock, StatAchievement } from './achievement-model';
import { AchievementQuery, type AchievementsModel } from './achievement-query';
import { AchievementRows, type AchievementGroup } from './achievement-rows';

/**
 * State of the achievements page: the filters (a signal form kept in the URL query params) and the achievements the
 * viewer marked done (kept in local storage). Provided by the page.
 */
@Injectable()
export class AchievementsStore {
	readonly rows = AchievementRows.build(
		Achievements.unlocks as AchievementUnlock[],
		Achievements.stats as StatAchievement[]
	);
	readonly categories = AchievementRows.CATEGORIES.map((value) => ({
		value,
		label: AchievementRows.categoryLabel(value),
	}));
	/** The content packs that have achievements. */
	readonly versions = GAME_VERSIONS.map((label, version) => ({ version, label })).filter((x) =>
		this.rows.some((r) => r.version === x.version)
	);

	readonly model = signal<AchievementsModel>(
		AchievementQuery.read(inject(ActivatedRoute).snapshot.queryParamMap, GAME_VERSIONS.length)
	);
	readonly form = form(this.model);

	/** The done flag of every achievement by row key; stored as the list of done keys. */
	readonly done = LocalStorage.persistedSignal<Record<string, boolean>>(
		'achievements-done',
		AchievementsStore.empty(this.rows.map((x) => x.key)),
		{
			parse: (value) =>
				Array.isArray(value)
					? { ...AchievementsStore.empty(this.rows.map((x) => x.key)), ...AchievementsStore.flags(value) }
					: undefined,
			serialize: (value) => Object.keys(value).filter((key) => value[key]),
		}
	);
	readonly doneForm = form(this.done);
	readonly doneCount = computed(() => this.rows.filter((x) => this.done()[x.key]).length);

	readonly groups = computed<AchievementGroup[]>(() => {
		const { search, category, version, hideDone } = this.model();
		const done = this.done();
		const rows = AchievementRows.filter(this.rows, {
			search: search.trim().toLowerCase(),
			category,
			version: version === '' ? -1 : Number(version),
			hideDone,
			done,
		});
		return AchievementRows.group(rows, done);
	});
	readonly shownCount = computed(() => this.groups().reduce((sum, x) => sum + x.rows.length, 0));

	constructor() {
		QueryParamSync.connect(
			this.model,
			{
				read: (params) => AchievementQuery.read(params, GAME_VERSIONS.length),
				write: (state) => AchievementQuery.write(state),
			},
			(state) => this.model.set(state)
		);
	}

	versionLabel(version: number): string {
		return GAME_VERSIONS[version] ?? '';
	}

	reset(): void {
		this.model.set({ ...AchievementQuery.DEFAULTS, spoilers: this.model().spoilers });
	}

	private static empty(keys: readonly string[]): Record<string, boolean> {
		return Object.fromEntries(keys.map((x) => [x, false]));
	}

	private static flags(keys: readonly unknown[]): Record<string, boolean> {
		return Object.fromEntries(keys.filter((x): x is string => typeof x === 'string').map((x) => [x, true]));
	}
}
