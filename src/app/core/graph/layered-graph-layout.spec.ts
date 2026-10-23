import { describe, expect, it } from 'vitest';
import { LayeredGraphLayout } from './layered-graph-layout';

describe('LayeredGraphLayout', () => {
	const options = { nodeWidth: 100, nodeHeight: 20, layerGap: 50, nodeGap: 10 };

	it('puts a node one layer right of its furthest predecessor', () => {
		// a > b > c, and a > c directly
		const layers = LayeredGraphLayout.layers(
			['a', 'b', 'c'],
			[
				{ from: 'a', to: 'b' },
				{ from: 'b', to: 'c' },
				{ from: 'a', to: 'c' },
			]
		);
		expect([...layers]).toEqual([
			['a', 0],
			['b', 1],
			['c', 2],
		]);
	});

	it('ignores an edge closing a cycle', () => {
		const layers = LayeredGraphLayout.layers(
			['a', 'b'],
			[
				{ from: 'a', to: 'b' },
				{ from: 'b', to: 'a' },
			]
		);
		expect(layers.get('a')! + layers.get('b')!).toBe(1);
	});

	it('places the layers in columns and centres the shorter ones', () => {
		const layout = LayeredGraphLayout.layout(
			['root', 'x', 'y'],
			[
				{ from: 'root', to: 'x' },
				{ from: 'root', to: 'y' },
			],
			options
		);
		expect(layout.nodes).toEqual([
			{ id: 'root', layer: 0, order: 0, x: 0, y: 15 },
			{ id: 'x', layer: 1, order: 0, x: 150, y: 0 },
			{ id: 'y', layer: 1, order: 1, x: 150, y: 30 },
		]);
		expect(layout.width).toBe(250);
		expect(layout.height).toBe(50);
		expect(layout.edges[0].path).toBe('M 100 25 C 125 25, 125 10, 150 10');
	});

	it('orders a layer by its neighbours to avoid crossings', () => {
		// a > d and b > c: c and d swap so the edges don't cross
		const layout = LayeredGraphLayout.layout(
			['a', 'b', 'c', 'd'],
			[
				{ from: 'a', to: 'd' },
				{ from: 'b', to: 'c' },
			],
			options
		);
		const order = (id: string) => layout.nodes.find((x) => x.id === id)!.order;
		expect(order('a')).toBeLessThan(order('b'));
		expect(order('d')).toBeLessThan(order('c'));
	});

	it('drops edges to unknown nodes and handles an empty graph', () => {
		expect(LayeredGraphLayout.layout(['a'], [{ from: 'a', to: 'zz' }], options).edges).toEqual([]);
		expect(LayeredGraphLayout.layout([], [], options)).toEqual({ nodes: [], edges: [], width: 0, height: 0 });
	});
});
