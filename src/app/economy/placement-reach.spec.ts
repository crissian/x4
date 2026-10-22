import { describe, expect, it } from 'vitest';
import type { SaveMap, SaveStation } from '../savegame/map/save-map-model';
import type { Sector } from '../shared/services/model/model';
import { TradeRouteTesting } from '../trade/trade-route-testing';
import { Economy } from './economy';
import { EconomyTesting } from './economy-testing';
import { PlacementContext } from './placement-context';
import type { PlacementLoop } from './placement-model';
import { PlacementRecipes } from './placement-recipes';
import { PlacementScorer } from './placement-scorer';

/** Random gate graphs with energy cell factories (supply) and hull parts factories (demand for energy cells). */
class ReachTesting {
	static readonly SECTORS = 14;

	/** A seeded random number generator (mulberry32), so a failing case can be told again. */
	static random(seed: number): () => number {
		let state = seed >>> 0;
		return () => {
			state = (state + 0x6d2b79f5) >>> 0;
			let t = state;
			t = Math.imul(t ^ (t >>> 15), t | 1);
			t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	}

	/** A connected graph: a random tree plus a few extra gates, and a random factory or none in each sector. */
	static world(seed: number): PlacementContext {
		const random = ReachTesting.random(seed);
		const ids = Array.from({ length: ReachTesting.SECTORS }, (_, i) => `s${i}`);
		const links = new Map(ids.map((id) => [id, new Set<string>()]));
		const link = (a: string, b: string) => {
			if (a !== b) {
				links.get(a)!.add(b);
				links.get(b)!.add(a);
			}
		};
		ids.slice(1).forEach((id, i) => link(id, ids[Math.floor(random() * (i + 1))]));
		for (let i = 0; i < 3; i++) {
			link(ids[Math.floor(random() * ids.length)], ids[Math.floor(random() * ids.length)]);
		}
		const sectors: Sector[] = ids.map((id) => TradeRouteTesting.sector(id, [...links.get(id)!]));
		const stations: SaveStation[] = [];
		ids.forEach((id, i) => {
			const roll = random();
			if (roll < 0.35) {
				const count = 1 + Math.floor(random() * 20);
				stations.push(ReachTesting.station(`E${i}`, id, EconomyTesting.ENERGY, count));
			} else if (roll < 0.7) {
				const count = 50 + Math.floor(random() * 400);
				stations.push(ReachTesting.station(`H${i}`, id, EconomyTesting.HULL_PARTS, count));
			}
		});
		const map: SaveMap = {
			sectors: ids.map((id) => ({ id, owner: 'teladi', contested: false, known: true })),
			stations,
			playerShips: {},
		};
		const economy = new Economy(map, EconomyTesting.wares, EconomyTesting.modules, sectors);
		const recipes = new PlacementRecipes(EconomyTesting.wares, EconomyTesting.modules);
		return new PlacementContext(economy, EconomyTesting.wares, recipes, sectors, map, undefined);
	}

	static station(code: string, sector: string, module: string, count: number): SaveStation {
		return EconomyTesting.station(code, sector, { modules: [module], moduleCounts: [count] });
	}
}

describe('a wider reach', () => {
	const ENERGY = 'energycells';
	const LOOPS: PlacementLoop[] = ['closed', 'open'];

	it('never lowers the absorbable or the Expected Cr/h of a spot', () => {
		let checked = 0;
		for (let seed = 1; seed <= 25; seed++) {
			const world = ReachTesting.world(seed);
			for (const sector of world.sectors()) {
				for (const loop of LOOPS) {
					let absorbable = 0;
					let crPerHour = 0;
					for (let jumps = 1; jumps <= 6; jumps++) {
						const options = { loop, jumps, hideHostile: true, includePlayer: true };
						const targets = PlacementScorer.targets(
							world,
							sector,
							jumps,
							world.localNet(ENERGY, options),
							world.residual(ENERGY, options)
						);
						const next = PlacementScorer.absorbable(targets);
						const spot = PlacementScorer.spot(world, ENERGY, sector, options);
						const label = `seed ${seed}, ${sector}, ${loop}, ${jumps} jumps`;
						expect(next, label).toBeGreaterThanOrEqual(absorbable - 1e-6);
						expect(spot?.crPerHour ?? 0, label).toBeGreaterThanOrEqual(crPerHour - 1e-6);
						absorbable = next;
						crPerHour = spot?.crPerHour ?? 0;
						checked += spot ? 1 : 0;
					}
				}
			}
		}
		// the worlds have spots to compare, not only empty ones
		expect(checked).toBeGreaterThan(100);
	});
});
