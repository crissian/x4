import type { Production, StationModule, Ware } from '../shared/services/model/model';
import type { WareService } from '../shared/services/ware.service';
import type { ModuleRow } from '../station/components/station-calculator.model';
import { ChainRecipes } from './chain-recipes';

/** `inputs` follows a ware down to the raw resources, `usedBy` up to the wares made from it. */
export type ChainDirection = 'inputs' | 'usedBy';

export interface ChainSettings {
	direction: ChainDirection;
	/** the preferred production method: `default`, a race id or `recycling` */
	method: string;
	/** production modules of the root ware the rates are for */
	modules: number;
	/** production method by ware id, over the preferred one */
	overrides: Readonly<Record<string, string>>;
	/** used by: levels of wares shown, 0 for all */
	depth: number;
}

export interface ChainNode {
	ware: Ware;
	/** the production the ware is made with; undefined for a raw resource */
	production?: Production;
	/** the module making it that way */
	module?: StationModule;
	/**
	 * Units per hour: inputs, what the chain needs (for the root, what its modules make); used by, what one
	 * production module makes.
	 */
	rate: number;
	/** inputs: production modules making the rate, unrounded; 0 for a raw resource */
	modules: number;
}

/** From the ware closer to the root to the next one: an input it needs, or a ware made from it. */
export interface ChainEdge {
	from: string;
	to: string;
	/** units of the input per hour: the chain's share (inputs), or what one module of `to` uses (used by) */
	rate: number;
}

export interface ChainGraph {
	root: string;
	direction: ChainDirection;
	/** the root first, every ware after the wares that lead to it */
	nodes: ChainNode[];
	edges: ChainEdge[];
}

/**
 * The production chain of a ware as a directed graph without cycles: each ware appears once, with the production
 * method picked for it, and the rates add up over all the wares needing it.
 */
export class ProductionChain {
	constructor(
		private readonly wares: WareService,
		private readonly recipes: ChainRecipes
	) {}

	build(root: string, settings: ChainSettings): ChainGraph | undefined {
		const ware = this.wares.getEntity(root);
		if (!ware) {
			return undefined;
		}
		const links = settings.direction === 'inputs' ? this.inputLinks(ware, settings) : this.usedByLinks(ware, settings);
		const order = ProductionChain.topological(root, links);
		const nodes = new Map<string, ChainNode>(
			order.map((id) => {
				const item = this.wares.getEntity(id)!;
				const production = ChainRecipes.pick(item, settings.method, settings.overrides[id]);
				const module = production ? this.recipes.module(item, production.method) : undefined;
				return [id, { ware: item, production, module, rate: 0, modules: 0 }];
			})
		);
		const edges: ChainEdge[] = [];
		const output = (node: ChainNode) =>
			node.production ? this.recipes.output(node.ware, node.production, node.module) : 0;

		if (settings.direction === 'inputs') {
			const first = nodes.get(root)!;
			first.rate = settings.modules * output(first);
			for (const id of order) {
				const node = nodes.get(id)!;
				const made = output(node);
				node.modules = made ? node.rate / made : 0;
				for (const to of links.get(id) ?? []) {
					const amount = node.production!.wares.find((x) => x.ware === to)!.amount;
					const rate = (node.rate * amount) / node.production!.amount;
					nodes.get(to)!.rate += rate;
					edges.push({ from: id, to, rate });
				}
			}
		} else {
			for (const id of order) {
				const node = nodes.get(id)!;
				node.rate = output(node);
				for (const to of links.get(id) ?? []) {
					const consumer = nodes.get(to)!;
					const amount = consumer.production!.wares.find((x) => x.ware === id)!.amount;
					edges.push({ from: id, to, rate: (output(consumer) * amount) / consumer.production!.amount });
				}
			}
		}
		return { root, direction: settings.direction, nodes: order.map((x) => nodes.get(x)!), edges };
	}

	/**
	 * The station calculator rows building the chain: the modules of every made ware, rounded up and merged when
	 * one module makes several; the raw resources are left to be bought or mined.
	 */
	static calculatorRows(graph: ChainGraph): ModuleRow[] {
		const rows: ModuleRow[] = [];
		for (const node of graph.nodes) {
			if (!node.module || !(node.modules > 0)) {
				continue;
			}
			// tiny float errors must not add a module
			const count = Math.ceil(node.modules - 1e-6);
			const row = rows.find((x) => x.moduleId === node.module!.id);
			if (row) {
				row.count += count;
			} else {
				rows.push({ moduleId: node.module.id, count });
			}
		}
		return rows;
	}

	/** Inputs of every ware, by ware id, as far as they go; an input leading back up the chain is left out. */
	private inputLinks(root: Ware, settings: ChainSettings): Map<string, string[]> {
		const links = new Map<string, string[]>();
		const path = new Set<string>();
		const visit = (ware: Ware) => {
			if (links.has(ware.id)) {
				return;
			}
			const next: string[] = [];
			links.set(ware.id, next);
			path.add(ware.id);
			const production = ChainRecipes.pick(ware, settings.method, settings.overrides[ware.id]);
			for (const input of production?.wares ?? []) {
				const item = this.wares.getEntity(input.ware);
				if (item && !path.has(item.id)) {
					next.push(item.id);
					visit(item);
				}
			}
			path.delete(ware.id);
		};
		visit(root);
		return links;
	}

	/** The wares made from every ware, by ware id, for `depth` levels (0 = all). */
	private usedByLinks(root: Ware, settings: ChainSettings): Map<string, string[]> {
		const all = this.wares.getEntities();
		const consumers = (id: string) =>
			all.filter((x) =>
				ChainRecipes.pick(x, settings.method, settings.overrides[x.id])?.wares.some((y) => y.ware === id)
			);
		const links = new Map<string, string[]>([[root.id, []]]);
		let level = [root.id];
		for (let depth = 1; level.length && (!settings.depth || depth <= settings.depth); depth++) {
			const next: string[] = [];
			for (const id of level) {
				for (const consumer of consumers(id)) {
					links.get(id)!.push(consumer.id);
					if (!links.has(consumer.id)) {
						links.set(consumer.id, []);
						next.push(consumer.id);
					}
				}
			}
			level = next;
		}
		return ProductionChain.withoutCycles(root.id, links);
	}

	/** The links with every link back to a ware on the way from the root dropped. */
	private static withoutCycles(root: string, links: Map<string, string[]>): Map<string, string[]> {
		const result = new Map<string, string[]>();
		const path = new Set<string>();
		const visit = (id: string) => {
			if (result.has(id)) {
				return;
			}
			const next: string[] = [];
			result.set(id, next);
			path.add(id);
			for (const to of links.get(id) ?? []) {
				if (!path.has(to)) {
					next.push(to);
					visit(to);
				}
			}
			path.delete(id);
		};
		visit(root);
		return result;
	}

	/** Every ware reachable from the root, each after all the wares linking to it. */
	private static topological(root: string, links: ReadonlyMap<string, string[]>): string[] {
		const incoming = new Map<string, number>([...links.keys()].map((x) => [x, 0]));
		for (const targets of links.values()) {
			targets.forEach((x) => incoming.set(x, (incoming.get(x) ?? 0) + 1));
		}
		const result: string[] = [];
		const ready = [root];
		while (ready.length) {
			const id = ready.shift()!;
			result.push(id);
			for (const to of links.get(id) ?? []) {
				const left = incoming.get(to)! - 1;
				incoming.set(to, left);
				if (left === 0) {
					ready.push(to);
				}
			}
		}
		return result;
	}
}
