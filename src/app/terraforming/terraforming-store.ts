import { Injectable, computed, inject, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';
import { QueryParamSync } from '../core/router/query-param-sync';
import { ActiveSave } from '../savegame/active-save';
import { ClusterService } from '../shared/services/universe.service';
import { WareService } from '../shared/services/ware.service';
import { TerraformingCatalog } from './terraforming-catalog';
import { TerraformingPlanetState } from './terraforming-planet-state';
import { TerraformingQuery, type TerraformingModel, type TerraformingView } from './terraforming-query';
import { TerraformingText } from './terraforming-text';

/**
 * State of the terraforming page: the planets, the picked one (a signal form) and the view, kept in the URL, and
 * the picked planet as the active save has it, or as the scripts set it up without a save. Provided by the page.
 */
@Injectable()
export class TerraformingStore {
	private readonly activeSave = inject(ActiveSave);
	private readonly clusters = inject(ClusterService);
	private readonly wares = inject(WareService);

	readonly catalog = new TerraformingCatalog();
	readonly text = new TerraformingText(this.catalog);
	readonly save = this.activeSave.save;
	private readonly terraforming = this.activeSave.terraforming;
	/** none without a save, reload-needed for a save read before terraforming was extracted */
	readonly status = this.activeSave.statusOf(this.terraforming);

	private readonly ids = this.catalog.planets.map((x) => x.cluster);
	/** The planets for the picker: planet and system names. */
	readonly options = this.catalog.planets.map((x) => ({
		id: x.cluster,
		name: `${x.name ?? x.part} (${this.clusters.getEntity(x.cluster)?.name ?? x.cluster})`,
	}));

	private readonly initial = TerraformingQuery.read(inject(ActivatedRoute).snapshot.queryParamMap, this.ids);
	readonly model = signal<TerraformingModel>(this.initial.model);
	readonly form = form(this.model);
	readonly view = signal<TerraformingView>(this.initial.view);

	readonly planet = computed(() => this.catalog.planet(this.model().planet) ?? this.catalog.planets[0]);
	readonly cluster = computed(() => this.clusters.getEntity(this.planet()?.cluster ?? ''));
	/** The first sector of the planet's system, for the links. */
	readonly sector = computed(() => this.cluster()?.sectors[0]);
	readonly state = computed(() => {
		const planet = this.planet();
		if (!planet) {
			return undefined;
		}
		const saved = this.terraforming()?.find((x) => x.cluster === planet.cluster && x.part === planet.part);
		return new TerraformingPlanetState(this.catalog, planet, saved);
	});

	constructor() {
		QueryParamSync.connect(
			computed(() => ({ model: this.model(), view: this.view() })),
			{
				read: (params) => TerraformingQuery.read(params, this.ids),
				write: (state) => TerraformingQuery.write(state, this.ids),
			},
			({ model, view }) => {
				this.model.set(model);
				this.view.set(view);
			}
		);
	}

	/** The worth of the wares at their average prices. */
	value(wares: readonly { ware: string; amount: number }[]): number {
		return wares.reduce((sum, x) => sum + x.amount * (this.wares.getEntity(x.ware)?.price.avg ?? 0), 0);
	}
}
