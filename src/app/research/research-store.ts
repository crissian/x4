import { Injectable, computed, inject, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';
import { QueryParamSync } from '../core/router/query-param-sync';
import { ActiveSave } from '../savegame/active-save';
import { Research } from '../shared/services/data/research-data';
import { WareService } from '../shared/services/ware.service';
import type { ResearchData, WareAmount } from './research-model';
import { ResearchProgress } from './research-progress';
import { ResearchQuery, type ResearchModel, type ResearchView } from './research-query';

/**
 * State of the research page: the projects, the research done in the active save, the view and filters (a signal
 * form) and the selected project, all kept in the URL query params. Provided by the page.
 */
@Injectable()
export class ResearchStore {
	private readonly activeSave = inject(ActiveSave);
	private readonly wares = inject(WareService);

	readonly save = this.activeSave.save;
	private readonly research = this.activeSave.research;
	/** none without a save, reload-needed for a save read before research was extracted */
	readonly status = this.activeSave.statusOf(this.research);
	readonly gameTime = this.activeSave.gameTime;

	/** Every project, by the game's sort order. */
	readonly projects: readonly ResearchData[] = Object.values(Research).sort(
		(a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)
	);
	readonly progress = computed(() => new ResearchProgress(this.projects, new Set(this.research() ?? [])));

	private readonly initial = ResearchQuery.read(
		inject(ActivatedRoute).snapshot.queryParamMap,
		(id) => !!Research[id]
	);
	readonly view = signal<ResearchView>(this.initial.view);
	readonly selectedId = signal(this.initial.id);
	readonly model = signal<ResearchModel>(this.initial.model);
	readonly form = form(this.model);

	/** The projects shown: the hidden ones only when asked for, and the selected one always. */
	readonly visible = computed(() => {
		const { hidden } = this.model();
		const selected = this.selectedId();
		return this.projects.filter((x) => hidden || !x.hidden || x.id === selected);
	});
	/** The ids of the shown projects the search matches; undefined without a search. */
	readonly matches = computed<ReadonlySet<string> | undefined>(() => {
		const search = this.model().search.trim().toLowerCase();
		if (!search) {
			return undefined;
		}
		const found = (text: string) => text.toLowerCase().includes(search);
		return new Set(
			this.visible()
				.filter((x) => found(x.name) || x.unlocks.some((u) => found(u.name)))
				.map((x) => x.id)
		);
	});
	/** The shown projects the search leaves, for the list. */
	readonly rows = computed(() => {
		const matches = this.matches();
		return matches ? this.visible().filter((x) => matches.has(x.id)) : this.visible();
	});

	readonly selected = computed(() => this.progress().get(this.selectedId()));
	/** What the selected project still takes. */
	readonly path = computed(() => {
		const selected = this.selected();
		return selected && this.progress().path(selected);
	});
	/** The ids on the selected project's path, the done prerequisites included, for highlighting. */
	readonly pathIds = computed<ReadonlySet<string>>(() => {
		const selected = this.selected();
		const ids = new Set<string>();
		const progress = this.progress();
		const visit = (item: ResearchData) => {
			if (!ids.has(item.id)) {
				ids.add(item.id);
				progress.requires(item).forEach(visit);
			}
		};
		if (selected) {
			visit(selected);
		}
		return ids;
	});
	/** The projects that can be started now. */
	readonly next = computed(() => this.progress().next());
	/** How many of the projects the headquarters lists are done. */
	readonly counts = computed(() => {
		const progress = this.progress();
		const listed = this.projects.filter((x) => !x.hidden && !x.missionOnly);
		return { done: listed.filter((x) => progress.isDone(x.id)).length, total: listed.length };
	});

	constructor() {
		QueryParamSync.connect(
			computed(() => ({ model: this.model(), view: this.view(), id: this.selectedId() })),
			{
				read: (params) => ResearchQuery.read(params, (id) => !!Research[id]),
				write: (state) => ResearchQuery.write(state),
			},
			({ model, view, id }) => {
				this.model.set(model);
				this.view.set(view);
				this.selectedId.set(id);
			}
		);
	}

	select(id: string) {
		this.selectedId.set(id);
	}

	/** The worth of the wares at their average prices. */
	value(wares: readonly WareAmount[]): number {
		return this.wares.averageValue(wares);
	}
}
