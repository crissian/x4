import { Component, computed, inject, input, output } from '@angular/core';
import { Duration } from '../../core/format/duration';
import { NumberFormats } from '../../core/format/number-formats';
import { DagLayout, type DagLayoutOptions } from '../../shared/graph/dag-layout';
import { WareService } from '../../shared/services/ware.service';
import { ResearchLabels } from '../research-labels';
import type { ResearchData } from '../research-model';
import type { ResearchProgress } from '../research-progress';

/**
 * The research projects as a tree, prerequisites left of the projects needing them; the projects without any link
 * are packed at the end. Each node shows its state, time and cost; a click selects it.
 */
@Component({
	selector: 'app-research-graph',
	templateUrl: './research-graph.component.html',
	styleUrl: './research-graph.component.css',
})
export class ResearchGraphComponent {
	static readonly OPTIONS: DagLayoutOptions = {
		nodeWidth: 210,
		nodeHeight: 64,
		layerGap: 44,
		nodeGap: 12,
		groupGap: 36,
	};


	private readonly wares = inject(WareService);

	readonly projects = input.required<readonly ResearchData[]>();
	readonly progress = input.required<ResearchProgress>();
	readonly selectedId = input('');
	/** the projects on the selected project's path, drawn stronger */
	readonly highlight = input<ReadonlySet<string>>(new Set());
	/** the projects a search found; the others are dimmed. Undefined without a search. */
	readonly matches = input<ReadonlySet<string>>();

	readonly select = output<string>();

	protected readonly size = ResearchGraphComponent.OPTIONS;
	protected readonly layout = computed(() =>
		DagLayout.layout(
			this.projects(),
			(x) => x.id,
			(x) => x.requires,
			ResearchGraphComponent.OPTIONS
		)
	);
	protected readonly nodes = computed(() => {
		const progress = this.progress();
		return this.layout().nodes.map(({ node, id, x, y }) => {
			const state = progress.state(node);
			const cost = node.wares.map((w) => `${this.wareName(w.ware)} ${NumberFormats.whole(w.amount)}`);
			return {
				id,
				x,
				y,
				project: node,
				tone: ResearchLabels.TONES[state],
				meta: [ResearchLabels.state(state), Duration.short(node.time)].join(' · '),
				cost: cost.join(' · '),
				title: [node.name, ...cost].join('\n'),
			};
		});
	});

	private wareName(id: string): string {
		return this.wares.getEntity(id)?.name ?? id;
	}
}
