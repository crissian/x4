import type { PlacementContext } from './placement-context';
import type {
	PlacementInput,
	PlacementOptions,
	PlacementResource,
	PlacementSpot,
	PlacementTarget,
} from './placement-model';
import { PlacementRecipes } from './placement-recipes';

/**
 * Scores one candidate factory: a ware made in a sector, selling to the sectors within reach. Pure maths over the
 * placement context, see the "How this is ranked" note of the page.
 */
export class PlacementScorer {
	/**
	 * How much a sector `jumps` away counts for a spot that reaches `reach` jumps: 1 at the spot, falling linearly
	 * to 1/(reach+1) at the edge (reach 3: 1, 0.75, 0.5, 0.25). Halving per jump was too drastic.
	 */
	static weight(jumps: number, reach: number): number {
		return 1 - jumps / (reach + 1);
	}

	/** The inputs or resources factor shown next to a spot: 0.5 + 0.5 × coverage. Not part of the ranking. */
	static factor(coverage: number): number {
		return 0.5 + 0.5 * coverage;
	}

	/**
	 * Units per hour the reach can take: the weighted shortage of the sectors that use more than they make, less the
	 * weighted surplus of those that make more than they use; never below 0.
	 */
	static absorbable(targets: readonly PlacementTarget[]): number {
		return Math.max(
			0,
			targets.reduce((sum, x) => sum + x.pull, 0)
		);
	}

	/** The sectors within reach of a spot whose own stations make or use the ware, the biggest pull first. */
	static targets(
		context: PlacementContext,
		sector: string,
		jumps: number,
		net: ReadonlyMap<string, number>
	): PlacementTarget[] {
		const result: PlacementTarget[] = [];
		for (const ring of context.reach(sector, jumps)) {
			const value = net.get(ring.sector) ?? 0;
			if (value) {
				const weight = PlacementScorer.weight(ring.jumps, jumps);
				result.push({ ...ring, weight, net: value, pull: -weight * value });
			}
		}
		return result.sort((a, b) => Math.abs(b.pull) - Math.abs(a.pull) || a.jumps - b.jumps);
	}

	/**
	 * The inputs of the ware's recipe around a spot. An input is in reach when its weighted net within reach is not
	 * negative and some station within reach makes it; a mined one when a sector within reach has the resource.
	 */
	static inputs(
		context: PlacementContext,
		ware: string,
		sector: string,
		options: PlacementOptions
	): PlacementInput[] {
		const recipe = context.recipes.recipe(ware);
		const reach = context.reach(sector, options.jumps);
		return (recipe?.inputs ?? []).map((input): PlacementInput => {
			if (context.mined(input.ware)) {
				const covered = reach.some((x) => context.sector(x.sector)?.resources.has(input.ware));
				return { ware: input.ware, mined: true, covered };
			}
			const net = context.localNet(input.ware, options.includePlayer);
			const produced = context.localProduced(input.ware, options.includePlayer);
			let balance = 0;
			let made = false;
			for (const ring of reach) {
				balance += PlacementScorer.weight(ring.jumps, options.jumps) * (net.get(ring.sector) ?? 0);
				made ||= produced.has(ring.sector);
			}
			return { ware: input.ware, balance, mined: false, covered: made && balance >= 0 };
		});
	}

	/** The share of the inputs in reach; 1 without inputs. */
	static coverage(inputs: readonly PlacementInput[]): number {
		return inputs.length ? inputs.filter((x) => x.covered).length / inputs.length : 1;
	}

	/**
	 * The mined wares of the ware's closed-loop chain and the nearest sector within reach that has each: a ware
	 * counts as available where any field of it exists, weighted by the same linear falloff as the demand.
	 */
	static resources(
		context: PlacementContext,
		ware: string,
		sector: string,
		options: PlacementOptions
	): PlacementResource[] {
		const recipe = context.recipes.recipe(ware);
		const reach = context.reach(sector, options.jumps);
		return (recipe ? context.recipes.chains.minedWares(recipe.module) : []).map((id): PlacementResource => {
			const nearest = reach.find((x) => context.sector(x.sector)?.resources.has(id));
			return nearest
				? { ware: id, jumps: nearest.jumps, weight: PlacementScorer.weight(nearest.jumps, options.jumps) }
				: { ware: id, weight: 0 };
		});
	}

	/** The weighted share of the chain's mined wares within reach; 1 without any. */
	static resourceCoverage(resources: readonly PlacementResource[]): number {
		return resources.length ? resources.reduce((sum, x) => sum + x.weight, 0) / resources.length : 1;
	}

	/**
	 * The spot, or undefined when it is excluded, the reach has no room for a single module or the ware earns
	 * nothing. `net` is each sector's own net per hour, lowered by the spots already picked. A closed-loop
	 * station sells at the average price; one that buys its inputs earns the price less their cost.
	 */
	static spot(
		context: PlacementContext,
		ware: string,
		sector: string,
		options: PlacementOptions,
		net: ReadonlyMap<string, number> = context.localNet(ware, options.includePlayer),
		known?: Pick<PlacementSpot, 'inputs' | 'resources'>
	): PlacementSpot | undefined {
		const recipe = context.recipes.recipe(ware);
		const info = context.sector(sector);
		if (!recipe || !info || context.excluded(ware, sector, options)) {
			return undefined;
		}
		const targets = PlacementScorer.targets(context, sector, options.jumps, net);
		const absorbable = PlacementScorer.absorbable(targets);
		const moduleOutput = PlacementRecipes.output(recipe, info.sunlight);
		const modules = moduleOutput > 0 ? Math.floor(absorbable / moduleOutput) : 0;
		if (modules < 1) {
			return undefined;
		}
		const closed = options.loop === 'closed';
		const price = context.price(ware);
		const margin = closed
			? price
			: price - PlacementRecipes.inputCost(recipe, info.sunlight, (x) => context.price(x));
		if (!(margin > 0)) {
			return undefined;
		}
		const inputs = known?.inputs ?? (closed ? [] : PlacementScorer.inputs(context, ware, sector, options));
		const resources = known?.resources ?? (closed ? PlacementScorer.resources(context, ware, sector, options) : []);
		return {
			ware,
			sector,
			modules,
			absorbable,
			moduleOutput,
			loop: options.loop,
			margin,
			crPerHour: Math.min(modules * moduleOutput, absorbable) * margin,
			coverage: closed ? PlacementScorer.resourceCoverage(resources) : PlacementScorer.coverage(inputs),
			security: info.security,
			building: context.isBuilding(ware),
			inputs,
			resources,
			targets,
		};
	}

	/**
	 * Takes what a picked spot sells out of the shortages around it, the nearest sectors first, so the next spots
	 * of the same ware don't count the same demand again.
	 */
	static allocate(spot: PlacementSpot, net: Map<string, number>): void {
		let left = spot.modules * spot.moduleOutput;
		const short = spot.targets.filter((x) => x.net < 0).sort((a, b) => a.jumps - b.jumps || a.net - b.net);
		for (const target of short) {
			if (left <= 0) {
				break;
			}
			const current = net.get(target.sector) ?? 0;
			const take = Math.min(left, -current);
			if (take > 0) {
				net.set(target.sector, current + take);
				left -= take;
			}
		}
	}
}
