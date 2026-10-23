import { DecimalPipe } from '@angular/common';
import { NumberFormats } from '../../core/format/number-formats';
import { Component, computed, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LayeredGraphLayout, type PlacedEdge } from '../../core/graph/layered-graph-layout';
import { entityImage } from '../../shared/services/data/images-data';
import type { ChainGraph, ChainNode } from '../production-chain';

/** A production method picked for a ware of the chain. */
export interface ChainMethodPick {
	ware: string;
	method: string;
}

/** A node of the drawn chain: the chain node, its box and its ware icon. */
interface DrawnNode {
	node: ChainNode;
	x: number;
	y: number;
	icon: string | null;
	root: boolean;
}

/**
 * The production chain drawn left to right: a box per ware (icon, link, rate, modules and its production methods
 * to pick from) and curves for the inputs. Scrolls sideways inside its own box on narrow screens.
 */
@Component({
	selector: 'app-production-chain-graph',
	imports: [RouterLink, DecimalPipe],
	templateUrl: './production-chain-graph.component.html',
	host: { class: 'block' },
})
export class ProductionChainGraphComponent {
	static readonly SIZES = { nodeWidth: 208, nodeHeight: 92, layerGap: 56, nodeGap: 12 };

	readonly graph = input.required<ChainGraph>();
	readonly pickMethod = output<ChainMethodPick>();

	protected readonly sizes = ProductionChainGraphComponent.SIZES;
	/** the ware under the pointer, whose curves are highlighted */
	protected readonly hovered = signal<string | undefined>(undefined);

	protected readonly layout = computed(() => {
		const graph = this.graph();
		const layout = LayeredGraphLayout.layout(
			graph.nodes.map((x) => x.ware.id),
			graph.edges,
			ProductionChainGraphComponent.SIZES
		);
		const nodes: DrawnNode[] = layout.nodes.map((placed, i) => ({
			node: graph.nodes[i],
			x: placed.x,
			y: placed.y,
			icon: entityImage('wares', placed.id),
			root: placed.id === graph.root,
		}));
		const rates = new Map(graph.edges.map((x) => [`${x.from}>${x.to}`, x]));
		const names = new Map(graph.nodes.map((x) => [x.ware.id, x.ware.name]));
		const edges = layout.edges.map((edge: PlacedEdge) => {
			const from = names.get(edge.from) ?? edge.from;
			const to = names.get(edge.to) ?? edge.to;
			const rate = NumberFormats.whole(rates.get(`${edge.from}>${edge.to}`)?.rate ?? 0);
			const title =
				graph.direction === 'usedBy'
					? $localize`One ${to}:consumer: module uses ${rate}:rate: ${from}:ware:/h`
					: $localize`${from}:consumer: needs ${rate}:rate: ${to}:ware:/h`;
			return { ...edge, title };
		});
		return { nodes, edges, width: layout.width, height: layout.height };
	});

	protected readonly usedBy = computed(() => this.graph().direction === 'usedBy');

	protected touches(edge: { from: string; to: string }, ware: string | undefined): boolean {
		return !!ware && (edge.from === ware || edge.to === ware);
	}
}
