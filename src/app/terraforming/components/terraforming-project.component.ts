import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Duration } from '../../core/format/duration';
import { ActiveSave } from '../../savegame/active-save';
import { DetailComponent, DetailPageComponent } from '../../shared/components/detail-page.component';
import { WareAmountsComponent } from '../../shared/components/ware-amounts/ware-amounts.component';
import { Research } from '../../shared/services/data/research-data';
import { WareGroups } from '../../shared/services/data/ware-groups-data';
import { WareService } from '../../shared/services/ware.service';
import { TerraformingCatalog } from '../terraforming-catalog';
import { TerraformingText } from '../terraforming-text';

/**
 * A terraforming project: what it needs (conditions, required research, wares), what it does (effects, side
 * effects, rebates, projects it removes) and the planets that offer it, laid out with the texts of the game's
 * terraforming menu (ui/addons/ego_detailmonitor/menu_terraforming.lua:820-1110).
 */
@Component({
	imports: [DetailComponent, DetailPageComponent, RouterLink, WareAmountsComponent],
	templateUrl: './terraforming-project.component.html',
})
export class TerraformingProjectComponent {
	private readonly wares = inject(WareService);
	private readonly terraforming = inject(ActiveSave).terraforming;

	/** the `:id` route param */
	readonly id = input.required<string>();

	protected readonly catalog = new TerraformingCatalog();
	protected readonly text = new TerraformingText(this.catalog);
	protected readonly label = (key: string) => this.catalog.label(key);
	protected readonly project = computed(() => this.catalog.project(this.id()));

	protected readonly group = computed(() => this.catalog.groupName(this.project()?.group ?? ''));
	protected readonly duration = computed(() => Duration.long(this.project()?.duration ?? 0));
	protected readonly cooldown = computed(() => Duration.long(this.project()?.repeatCooldown ?? 0));
	protected readonly chance = computed(() =>
		this.label('successChance').replace('$CHANCE$', `${this.project()?.chance ?? 100}`)
	);
	protected readonly research = computed(() => {
		const id = this.project()?.research;
		return id ? { id, name: Research[id as keyof typeof Research]?.name ?? id } : undefined;
	});

	/** the conditions the menu shows, each with the blocks that meet it (menu_terraforming.lua:1199-1232) */
	protected readonly conditions = computed(() =>
		(this.project()?.conditions ?? []).flatMap((condition) => {
			const text = this.text.condition(condition);
			return text ? [{ text, blocks: this.text.conditionBlocks(condition) ?? [] }] : [];
		})
	);
	protected readonly effects = computed(() => (this.project()?.effects ?? []).map((x) => this.text.effect(x)));
	protected readonly sideEffects = computed(() =>
		(this.project()?.sideEffects ?? []).map((x) => ({
			...x,
			effect: x.stat ? this.text.effect({ stat: x.stat, change: x.change }) : undefined,
		}))
	);
	protected readonly rebates = computed(() =>
		(this.project()?.rebates ?? []).map((x) => ({
			name: x.ware
				? (this.wares.getEntity(x.ware)?.name ?? x.ware)
				: (WareGroups.all.find((g) => g.id === x.wareGroup)?.name ?? x.wareGroup ?? ''),
			value: x.value,
		}))
	);
	protected readonly removes = computed(() => this.links(this.project()?.removes ?? []));

	/** The planets offering the project: in the active save, else as the scripts set them up. */
	protected readonly planets = computed(() => {
		const id = this.id();
		const saved = this.terraforming();
		return this.catalog.planets.flatMap((planet) => {
			const offered = saved
				? saved
						.find((x) => x.cluster === planet.cluster && x.part === planet.part)
						?.projects.find((x) => x.id === id)
				: planet.projects.find((x) => x.id === id);
			if (!offered) {
				return [];
			}
			return [
				{
					cluster: planet.cluster,
					name: planet.name ?? planet.part,
					predecessors: this.links(offered.predecessors),
					any: !!offered.any,
					completed: 'completed' in offered ? (offered.completed ?? 0) : 0,
				},
			];
		});
	});
	protected readonly fromSave = computed(() => !!this.terraforming());

	private links(ids: readonly string[]) {
		return ids.map((id) => ({ id, name: this.catalog.projectName(id), known: !!this.catalog.project(id) }));
	}
}
