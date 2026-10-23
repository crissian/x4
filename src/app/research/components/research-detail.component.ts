import { DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Duration } from '../../core/format/duration';
import { ToneDotComponent } from '../../shared/components/tone-dot/tone-dot.component';
import { WareAmountsComponent } from '../../shared/components/ware-amounts/ware-amounts.component';
import { Descriptions } from '../../shared/services/descriptions';
import { EquipmentService } from '../../shared/services/equipment.service';
import { ModuleService } from '../../shared/services/module.service';
import { ShipService } from '../../shared/services/ship.service';
import { ResearchLabels } from '../research-labels';
import type { ResearchData, ResearchUnlockData, ResearchUnlockKind } from '../research-model';
import { ResearchStore } from '../research-store';
import { ResearchLinkComponent } from './research-link.component';

/** The selected research project: description, cost, links in the tree, what it unlocks and what it still takes. */
@Component({
	selector: 'app-research-detail',
	imports: [DecimalPipe, ResearchLinkComponent, RouterLink, ToneDotComponent, WareAmountsComponent],
	templateUrl: './research-detail.component.html',
})
export class ResearchDetailComponent {
	private static readonly KINDS: readonly ResearchUnlockKind[] = ['module', 'ship', 'equipment', 'mod', 'ware'];

	protected readonly store = inject(ResearchStore);
	private readonly entities: Partial<Record<ResearchUnlockKind, { getEntity(id: string): unknown }>> = {
		module: inject(ModuleService),
		ship: inject(ShipService),
		equipment: inject(EquipmentService),
	};

	protected readonly project = this.store.selected;
	protected readonly description = Descriptions.of('research', () => this.project()?.id);
	protected readonly state = computed(() => {
		const project = this.project();
		return project && this.store.progress().state(project);
	});
	protected readonly tone = computed(() => ResearchLabels.TONES[this.state() ?? 'locked']);
	protected readonly stateLabel = computed(() => ResearchLabels.state(this.state() ?? 'locked'));
	protected readonly time = computed(() => Duration.short(this.project()?.time ?? 0));
	protected readonly value = computed(() => this.store.value(this.project()?.wares ?? []));
	protected readonly requires = computed(() =>
		this.links(this.project() && this.store.progress().requires(this.project()!))
	);
	protected readonly requiredBy = computed(() =>
		this.links(this.project() && this.store.progress().requiredBy(this.project()!))
	);
	/** The unlocked wares by kind, each linked to its page when it has one. */
	protected readonly unlocks = computed(() => {
		const unlocks = this.project()?.unlocks ?? [];
		return ResearchDetailComponent.KINDS.map((kind) => ({
			kind,
			label: ResearchLabels.kind(kind),
			items: unlocks
				.filter((x) => x.kind === kind)
				.map((x) => ({ ...x, route: this.route(x) }))
				.sort((a, b) => a.name.localeCompare(b.name)),
		})).filter((x) => x.items.length);
	});
	protected readonly path = this.store.path;
	protected readonly pathValue = computed(() => this.store.value(this.path()?.wares ?? []));
	protected readonly steps = computed(() => this.links(this.path()?.steps));

	private links(projects: readonly ResearchData[] | undefined) {
		const progress = this.store.progress();
		return (projects ?? []).map((project) => ({ project, state: progress.state(project) }));
	}

	private route(unlock: ResearchUnlockData): string | undefined {
		const route = ResearchLabels.route(unlock.kind);
		return route && this.entities[unlock.kind]?.getEntity(unlock.id) ? route : undefined;
	}
}
