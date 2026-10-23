/** An edge of a directed graph, by node id. */
export interface GraphEdge {
	from: string;
	to: string;
}

/** Sizes of the boxes and gaps, in pixels. */
export interface LayeredGraphOptions {
	nodeWidth: number;
	nodeHeight: number;
	/** space between two layers (columns) */
	layerGap: number;
	/** space between two nodes of a layer */
	nodeGap: number;
}

/** A node placed by the layout; x and y are its top left corner. */
export interface PlacedNode {
	id: string;
	/** column, 0 for the sources */
	layer: number;
	/** row within the layer */
	order: number;
	x: number;
	y: number;
}

/** An edge drawn from the right side of `from` to the left side of `to`, as an SVG path. */
export interface PlacedEdge extends GraphEdge {
	path: string;
}

export interface GraphLayout {
	nodes: PlacedNode[];
	edges: PlacedEdge[];
	width: number;
	height: number;
}

/**
 * Lays out a directed acyclic graph in columns, left to right: a node sits one layer right of its furthest
 * predecessor (longest path), and the nodes of every layer are ordered by the mean row of their neighbours
 * (barycenter sweeps) to cut down crossings. Edges closing a cycle are left out of the layering.
 */
export class LayeredGraphLayout {
	static readonly SWEEPS = 4;

	static layout(ids: readonly string[], edges: readonly GraphEdge[], options: LayeredGraphOptions): GraphLayout {
		const known = new Set(ids);
		const valid = edges.filter((x) => known.has(x.from) && known.has(x.to) && x.from !== x.to);
		const layers = LayeredGraphLayout.layers(ids, valid);
		const rows = LayeredGraphLayout.order(ids, valid, layers);

		const rowStep = options.nodeHeight + options.nodeGap;
		const layerStep = options.nodeWidth + options.layerGap;
		const tallest = Math.max(0, ...rows.map((x) => x.length));
		const nodes: PlacedNode[] = rows.flatMap((row, layer) =>
			row.map((id, order) => ({
				id,
				layer,
				order,
				x: layer * layerStep,
				// shorter layers are centred on the tallest
				y: ((tallest - row.length) * rowStep) / 2 + order * rowStep,
			}))
		);
		const byId = new Map(nodes.map((x) => [x.id, x]));
		return {
			nodes: ids.map((x) => byId.get(x)!),
			edges: valid.map((edge) => LayeredGraphLayout.edge(edge, byId.get(edge.from)!, byId.get(edge.to)!, options)),
			width: rows.length ? rows.length * layerStep - options.layerGap : 0,
			height: tallest ? tallest * rowStep - options.nodeGap : 0,
		};
	}

	/** The layer of every node: the longest path to it from a node without predecessors. */
	static layers(ids: readonly string[], edges: readonly GraphEdge[]): Map<string, number> {
		const incoming = new Map<string, string[]>(ids.map((x) => [x, []]));
		for (const edge of edges) {
			incoming.get(edge.to)?.push(edge.from);
		}
		const result = new Map<string, number>();
		const visiting = new Set<string>();
		const visit = (id: string): number => {
			const done = result.get(id);
			if (done !== undefined) {
				return done;
			}
			visiting.add(id);
			let layer = 0;
			for (const from of incoming.get(id) ?? []) {
				// a predecessor still being visited closes a cycle: that edge doesn't count
				if (!visiting.has(from)) {
					layer = Math.max(layer, visit(from) + 1);
				}
			}
			visiting.delete(id);
			result.set(id, layer);
			return layer;
		};
		ids.forEach(visit);
		return result;
	}

	/** The node ids of every layer, top to bottom. */
	private static order(
		ids: readonly string[],
		edges: readonly GraphEdge[],
		layers: ReadonlyMap<string, number>
	): string[][] {
		const rows: string[][] = [];
		for (const id of ids) {
			(rows[layers.get(id)!] ??= []).push(id);
		}
		for (let i = 0; i < rows.length; i++) {
			rows[i] ??= [];
		}
		const neighbours = (id: string, down: boolean) =>
			edges.filter((x) => (down ? x.to : x.from) === id).map((x) => (down ? x.from : x.to));

		for (let sweep = 0; sweep < LayeredGraphLayout.SWEEPS; sweep++) {
			const down = sweep % 2 === 0;
			const position = new Map(rows.flatMap((row) => row.map((id, i) => [id, i] as const)));
			const range = rows.map((_, i) => i);
			for (const layer of down ? range.slice(1) : range.reverse().slice(1)) {
				const row = rows[layer];
				const centre = new Map(
					row.map((id, i) => {
						const rows = neighbours(id, down).map((x) => position.get(x)!);
						return [id, rows.length ? rows.reduce((a, b) => a + b, 0) / rows.length : i] as const;
					})
				);
				// stable sort keeps the given order among equal centres
				rows[layer] = [...row].sort((a, b) => centre.get(a)! - centre.get(b)!);
				rows[layer].forEach((id, i) => position.set(id, i));
			}
		}
		return rows;
	}

	private static edge(edge: GraphEdge, from: PlacedNode, to: PlacedNode, options: LayeredGraphOptions): PlacedEdge {
		const x1 = from.x + options.nodeWidth;
		const y1 = from.y + options.nodeHeight / 2;
		const x2 = to.x;
		const y2 = to.y + options.nodeHeight / 2;
		const bend = Math.max(options.layerGap / 2, (x2 - x1) / 3);
		return {
			...edge,
			path: `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`,
		};
	}
}
