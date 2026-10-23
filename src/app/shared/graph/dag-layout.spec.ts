import { describe, expect, it } from 'vitest';
import { DagLayout, DagLayoutOptions } from './dag-layout';

interface TestNode {
	id: string;
	parents: string[];
}

class DagFixture {
	static readonly OPTIONS: DagLayoutOptions = {
		nodeWidth: 100,
		nodeHeight: 20,
		layerGap: 50,
		nodeGap: 10,
		groupGap: 40,
	};

	static run(nodes: TestNode[], options: Partial<DagLayoutOptions> = {}) {
		return DagLayout.layout(
			nodes,
			(x) => x.id,
			(x) => x.parents,
			{ ...DagFixture.OPTIONS, ...options }
		);
	}

	static node(id: string, ...parents: string[]): TestNode {
		return { id, parents };
	}
}

describe('DagLayout', () => {
	it('puts each node one column after its latest parent', () => {
		const result = DagFixture.run([
			DagFixture.node('a'),
			DagFixture.node('b', 'a'),
			DagFixture.node('c', 'a', 'b'),
		]);
		expect(result.nodes.map((x) => [x.id, x.layer, x.x])).toEqual([
			['a', 0, 0],
			['b', 1, 150],
			['c', 2, 300],
		]);
		expect(result.edges.map((x) => `${x.from}>${x.to}`)).toEqual(['a>b', 'a>c', 'b>c']);
		expect(result.width).toBe(400);
		expect(result.height).toBe(20);
	});

	it('draws edges from the right side of the parent to the left side of the child', () => {
		const result = DagFixture.run([DagFixture.node('a'), DagFixture.node('b', 'a')]);
		expect(result.edges[0].path).toBe('M 100 10 C 125 10, 125 10, 150 10');
	});

	it('orders a column by the positions of the parents to avoid crossings', () => {
		const result = DagFixture.run([
			DagFixture.node('a'),
			DagFixture.node('b'),
			DagFixture.node('fromB', 'b'),
			DagFixture.node('fromA', 'a'),
		]);
		const y = Object.fromEntries(result.nodes.map((x) => [x.id, x.y]));
		expect(y['a']).toBeLessThan(y['b']);
		expect(y['fromA']).toBeLessThan(y['fromB']);
	});

	it('stacks connected groups and packs nodes without edges into a grid', () => {
		const result = DagFixture.run(
			[
				DagFixture.node('x'),
				DagFixture.node('a'),
				DagFixture.node('b', 'a'),
				DagFixture.node('y'),
				DagFixture.node('z'),
			],
			{ singleColumns: 2 }
		);
		const placed = Object.fromEntries(result.nodes.map((x) => [x.id, [x.x, x.y]]));
		expect(placed['a']).toEqual([0, 0]);
		expect(placed['b']).toEqual([150, 0]);
		// the singles start below the group: 20 high + 40 gap
		expect(placed['x']).toEqual([0, 60]);
		expect(placed['y']).toEqual([150, 60]);
		expect(placed['z']).toEqual([0, 90]);
		expect(result.height).toBe(110);
	});

	it('centres a shorter column against the tallest one', () => {
		const result = DagFixture.run([DagFixture.node('a'), DagFixture.node('b', 'a'), DagFixture.node('c', 'a')]);
		const y = Object.fromEntries(result.nodes.map((x) => [x.id, x.y]));
		expect(y['a']).toBe(15);
		expect([y['b'], y['c']].sort()).toEqual([0, 30]);
	});

	it('ignores unknown parents, self references and the edge closing a cycle', () => {
		const result = DagFixture.run([DagFixture.node('a', 'missing', 'a', 'b'), DagFixture.node('b', 'a')]);
		expect(result.nodes.map((x) => x.layer).sort()).toEqual([0, 1]);
		expect(result.edges).toHaveLength(1);
	});

	it('returns an empty drawing without nodes', () => {
		expect(DagFixture.run([])).toEqual({ nodes: [], edges: [], width: 0, height: 0 });
	});
});
