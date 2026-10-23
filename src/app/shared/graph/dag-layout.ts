/** Sizes of a layered graph drawing, in pixels. */
export interface DagLayoutOptions {
	nodeWidth: number;
	nodeHeight: number;
	/** between two layers (columns) */
	layerGap: number;
	/** between two nodes of a layer */
	nodeGap: number;
	/** between two connected groups of nodes */
	groupGap: number;
	/** columns of the grid the nodes without any edge are packed into; defaults to the widest group's layers, at least 3 */
	singleColumns?: number;
}

export interface DagPlacedNode<T> {
	node: T;
	id: string;
	/** left edge */
	x: number;
	/** top edge */
	y: number;
	/** column, counted from the nodes without parents */
	layer: number;
}

export interface DagPlacedEdge {
	/** parent id */
	from: string;
	/** child id */
	to: string;
	/** SVG path from the parent's right side to the child's left side */
	path: string;
}

export interface DagLayoutResult<T> {
	nodes: DagPlacedNode<T>[];
	edges: DagPlacedEdge[];
	width: number;
	height: number;
}

/**
 * Lays out a directed acyclic graph left to right: parents in earlier columns than their children (longest path
 * layering), nodes of a column ordered by the mean position of their neighbours to cut down crossings. Each weakly
 * connected group is drawn below the previous one, in the order of its first node in the input; the nodes without
 * any edge are packed into a grid at the end. Parent ids missing from the nodes are ignored, and so is an edge that
 * closes a cycle.
 */
export class DagLayout {
	private static readonly SWEEPS = 4;

	static layout<T>(
		nodes: readonly T[],
		idOf: (node: T) => string,
		parentsOf: (node: T) => readonly string[],
		options: DagLayoutOptions
	): DagLayoutResult<T> {
		const byId = new Map(nodes.map((x) => [idOf(x), x]));
		const ids = [...byId.keys()];
		const parents = new Map(
			ids.map((id) => [id, [...new Set(parentsOf(byId.get(id)!))].filter((p) => byId.has(p) && p !== id)])
		);
		const layers = DagLayout.layers(ids, parents);
		// edges closing a cycle point back to an equal or later column: dropped
		for (const [id, list] of parents) {
			parents.set(
				id,
				list.filter((p) => layers.get(p)! < layers.get(id)!)
			);
		}
		const children = new Map<string, string[]>(ids.map((id) => [id, []]));
		for (const [id, list] of parents) {
			list.forEach((p) => children.get(p)!.push(id));
		}

		const groups = DagLayout.groups(ids, parents, children);
		const connected = groups.filter((x) => x.length > 1);
		const singles = groups.filter((x) => x.length === 1).map((x) => x[0]);

		const { nodeWidth, nodeHeight, layerGap, nodeGap, groupGap } = options;
		const columnStep = nodeWidth + layerGap;
		const rowStep = nodeHeight + nodeGap;
		const placed = new Map<string, DagPlacedNode<T>>();
		let top = 0;
		let columns = 1;
		for (const group of connected) {
			const order = DagLayout.order(group, layers, parents, children);
			const rows = Math.max(...order.map((x) => x.length));
			columns = Math.max(columns, order.length);
			order.forEach((column, layer) => {
				// a shorter column is centred against the tallest one
				const offset = ((rows - column.length) * rowStep) / 2;
				column.forEach((id, index) =>
					placed.set(id, {
						node: byId.get(id)!,
						id,
						layer,
						x: layer * columnStep,
						y: top + offset + index * rowStep,
					})
				);
			});
			top += rows * rowStep - nodeGap + groupGap;
		}
		const gridColumns = Math.max(1, options.singleColumns ?? Math.max(columns, 3));
		singles.forEach((id, index) => {
			const column = index % gridColumns;
			const row = Math.floor(index / gridColumns);
			placed.set(id, { node: byId.get(id)!, id, layer: 0, x: column * columnStep, y: top + row * rowStep });
		});
		if (singles.length) {
			top += Math.ceil(singles.length / gridColumns) * rowStep - nodeGap + groupGap;
			columns = Math.max(columns, Math.min(gridColumns, singles.length));
		}

		const edges: DagPlacedEdge[] = [];
		for (const id of ids) {
			const child = placed.get(id)!;
			for (const parentId of parents.get(id)!) {
				edges.push({ from: parentId, to: id, path: DagLayout.edgePath(placed.get(parentId)!, child, options) });
			}
		}

		return {
			nodes: ids.map((id) => placed.get(id)!),
			edges,
			width: nodes.length ? columns * columnStep - layerGap : 0,
			height: nodes.length ? Math.max(0, top - groupGap) : 0,
		};
	}

	/** The column of each node: one past its latest parent, 0 without parents. */
	private static layers(
		ids: readonly string[],
		parents: ReadonlyMap<string, readonly string[]>
	): Map<string, number> {
		const result = new Map<string, number>();
		const visiting = new Set<string>();
		const visit = (id: string): number => {
			const known = result.get(id);
			if (known !== undefined) {
				return known;
			}
			if (visiting.has(id)) {
				return -1;
			}
			visiting.add(id);
			const layer = Math.max(-1, ...parents.get(id)!.map(visit)) + 1;
			visiting.delete(id);
			result.set(id, layer);
			return layer;
		};
		ids.forEach(visit);
		return result;
	}

	/** The weakly connected groups, each in input order, ordered by their first node. */
	private static groups(
		ids: readonly string[],
		parents: ReadonlyMap<string, readonly string[]>,
		children: ReadonlyMap<string, readonly string[]>
	): string[][] {
		const index = new Map(ids.map((id, i) => [id, i]));
		const seen = new Set<string>();
		const result: string[][] = [];
		for (const start of ids) {
			if (seen.has(start)) {
				continue;
			}
			const group: string[] = [];
			const stack = [start];
			seen.add(start);
			while (stack.length) {
				const id = stack.pop()!;
				group.push(id);
				for (const next of [...parents.get(id)!, ...children.get(id)!]) {
					if (!seen.has(next)) {
						seen.add(next);
						stack.push(next);
					}
				}
			}
			result.push(group.sort((a, b) => index.get(a)! - index.get(b)!));
		}
		return result;
	}

	/** The columns of a group, each ordered by alternating sweeps of neighbour barycentres. */
	private static order(
		group: readonly string[],
		layers: ReadonlyMap<string, number>,
		parents: ReadonlyMap<string, readonly string[]>,
		children: ReadonlyMap<string, readonly string[]>
	): string[][] {
		const columns: string[][] = [];
		for (const id of group) {
			(columns[layers.get(id)!] ??= []).push(id);
		}
		const position = new Map<string, number>();
		const remember = (column: readonly string[]) => column.forEach((id, i) => position.set(id, i));
		columns.forEach(remember);
		const sortBy = (column: string[], neighbours: ReadonlyMap<string, readonly string[]>) => {
			const keyed = column.map((id, i) => {
				const list = neighbours.get(id)!;
				const mean = list.length ? list.reduce((sum, x) => sum + position.get(x)!, 0) / list.length : i;
				return { id, mean, i };
			});
			keyed.sort((a, b) => a.mean - b.mean || a.i - b.i);
			column.splice(0, column.length, ...keyed.map((x) => x.id));
			remember(column);
		};
		for (let sweep = 0; sweep < DagLayout.SWEEPS; sweep++) {
			for (let i = 1; i < columns.length; i++) {
				sortBy(columns[i], parents);
			}
			for (let i = columns.length - 2; i >= 0; i--) {
				sortBy(columns[i], children);
			}
		}
		return columns;
	}

	private static edgePath(
		from: DagPlacedNode<unknown>,
		to: DagPlacedNode<unknown>,
		options: DagLayoutOptions
	): string {
		const x1 = from.x + options.nodeWidth;
		const y1 = from.y + options.nodeHeight / 2;
		const x2 = to.x;
		const y2 = to.y + options.nodeHeight / 2;
		const bend = Math.max(options.layerGap / 2, (x2 - x1) / 3);
		return `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`;
	}
}
