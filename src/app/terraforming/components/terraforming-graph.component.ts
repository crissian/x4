import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DagLayout, type DagLayoutOptions } from '../../shared/graph/dag-layout';
import type { TerraformingProjectRow } from '../terraforming-planet-state';

/**
 * A planet's projects as a graph, predecessors left of the projects needing them; dashed edges lead to a project
 * that needs any one of its predecessors; the projects completed in the save are green. The projects without any
 * link are packed at the end; each links to its page.
 */
@Component({
	selector: 'app-terraforming-graph',
	imports: [RouterLink],
	templateUrl: './terraforming-graph.component.html',
	styleUrl: './terraforming-graph.component.css',
})
export class TerraformingGraphComponent {
	static readonly OPTIONS: DagLayoutOptions = {
		nodeWidth: 200,
		nodeHeight: 46,
		layerGap: 40,
		nodeGap: 10,
		groupGap: 30,
	};

	readonly rows = input.required<readonly TerraformingProjectRow[]>();
	/** the game's "Times completed" text */
	readonly completedLabel = input.required<string>();

	protected readonly size = TerraformingGraphComponent.OPTIONS;
	protected readonly layout = computed(() =>
		DagLayout.layout(
			this.rows(),
			(x) => x.id,
			(x) => x.predecessors,
			TerraformingGraphComponent.OPTIONS
		)
	);
	/** the ids of the projects needing any one predecessor */
	protected readonly anyOf = computed(
		() =>
			new Set(
				this.rows()
					.filter((x) => x.any)
					.map((x) => x.id)
			)
	);
	protected readonly nodes = computed(() =>
		this.layout().nodes.map(({ node, id, x, y }) => ({
			id,
			x,
			y,
			row: node,
			tone: node.completed ? 'green' : 'grey',
			state: node.completed ? `${this.completedLabel()}: ${node.completed}` : '',
		}))
	);
}
