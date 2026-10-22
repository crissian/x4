import { ModuleWorker, Production, StationModule, Ware } from '../../shared/services/model/model';
import { WareService } from '../../shared/services/ware.service';
import { ModuleService } from '../../shared/services/module.service';
import { ModuleTypes } from '../../shared/services/data/module-types-data';
import { ProductionMethods } from '../../shared/services/data/production-method-data';
import { Workers } from '../../shared/services/data/workers-data';
import { Effects } from '../../shared/services/data/effects-data';
import { Wares } from '../../shared/services/data/wares-data';

/** Workers the player headquarters needs on top of its modules. */
export const HQ_WORKFORCE = 200;

export interface StationResourceItemModel {
	ware: Ware;
	count: number;
	amount: number;
	efficiency: number;
	name: string;
	total: number;
	type: string;
}

export interface StationResourceModel {
	ware: Ware;
	amount: number;
	items: StationResourceItemModel[];
	expanded?: boolean;
}

export interface WareGroupModel {
	name: string;
	modules: StationModule[];
}

export interface WareProductionData {
	ware: Ware;
	count: number;
	amount: number;
	efficiency: number;
	name: string;
	total: number;
	type: string;
}

export interface StationProduction {
	amount: number;
	ware: Ware;
	value: Production;
}

/** A row of the station layout, edited through the station modules form. */
export interface ModuleRow {
	moduleId: string;
	count: number;
}

/** Station settings, edited through the calculator and summary forms. */
export interface StationSettings {
	sunlight: number;
	isHq: boolean;
	autoWorkforce: boolean;
	partialWorkforce: number;
	/** hours of production and consumption the storage should hold */
	storageHours: number;
	provideBasicResources: boolean;
	provideAllResources: boolean;
	resourcesPrice: number;
	productsPrice: number;
	modulesResourcesPrice: number;
}

export const DEFAULT_STATION_SETTINGS: StationSettings = {
	sunlight: 100,
	isHq: false,
	autoWorkforce: true,
	partialWorkforce: 0,
	storageHours: 2,
	provideBasicResources: false,
	provideAllResources: false,
	resourcesPrice: 50,
	productsPrice: 50,
	modulesResourcesPrice: 50,
};

/** Production and needs of a module row, calculated once from its module id and count. */
export class StationModuleModel {
	readonly module?: StationModule;
	readonly needs: { amount: number; ware: Ware }[] = [];
	readonly production?: StationProduction[];

	constructor(
		private wareService: WareService,
		private moduleService: ModuleService,
		readonly moduleId = '',
		readonly count = 1
	) {
		const module = moduleId ? this.moduleService.getEntity(moduleId) : undefined;
		if (!module) {
			return;
		}
		this.module = module;
		this.production = [];

		if (module.type == ModuleTypes.production) {
			const productions = (module.product ?? []).flatMap((ware) => {
				const production = this.productionOf(module, ware);
				return production ? [{ ware, production }] : [];
			});
			// modules making several wares (the scrap recyclers) run one cycle of each in turn
			const queueTime = productions.reduce((sum, x) => sum + x.production.time, 0);

			for (const { ware, production } of productions) {
				// cycles per hour
				const cycles = 3600 / queueTime;

				this.production.push({ amount: production.amount * cycles, ware, value: production });
				for (const x of production.wares) {
					const neededWare = this.wareService.getEntity(x.ware);
					if (neededWare) {
						this.needs.push({ amount: x.amount * cycles, ware: neededWare });
					}
				}
			}
		} else if (module.type == ModuleTypes.processingmodule) {
			// processors turn recyclables into scrap with the processing method, many wares per cycle
			for (const { ware, amount } of module.processing ?? []) {
				const production = ware.production?.find((x) => x.method == ProductionMethods.processing);
				if (!production) {
					continue;
				}

				const cycles = 3600 / production.time;
				this.production.push({ amount: production.amount * amount * cycles, ware, value: production });
				for (const x of production.wares) {
					const neededWare = this.wareService.getEntity(x.ware);
					if (neededWare) {
						this.needs.push({ amount: x.amount * amount * cycles, ware: neededWare });
					}
				}
			}
		} else if (module.type == ModuleTypes.habitation && module.workForce?.race) {
			const capacity = module.workForce.capacity ?? 0;
			const worker: ModuleWorker = Workers.get(module.workForce.race.id);

			worker.consumption.forEach((x) => {
				this.needs.push({ amount: (x.amount * capacity) / worker.amount, ware: x.ware });
			});
		}
	}

	/** The production method the module queues the ware with, the default one when the ware has no such method. */
	private productionOf(module: StationModule, ware: Ware): Production | undefined {
		const productions = ware.production ?? [];
		const byMethod = (method?: string) => productions.find((x) => x.method == method);
		const method = module.queue?.find((x) => x.ware.id == ware.id)?.method;
		return byMethod(method) || byMethod(ProductionMethods.default);
	}
}

export class ResourceCalculator {
	/** Workforce needed (`value`, including the HQ workers) and housed (`capacity`) by the station. */
	static calculateWorkforce(modules: StationModuleModel[], isHq = false) {
		const totalWorkforce = modules.reduce((acc, item) => {
			if (item.module && item.module.workForce && item.module.workForce.max) {
				return acc + item.count * item.module.workForce.max;
			}
			return acc;
		}, 0);

		const workforce = modules.reduce((acc, item) => {
			if (item.module && item.module.workForce && item.module.workForce.capacity) {
				return acc + item.count * item.module.workForce.capacity;
			}
			return acc;
		}, 0);

		return { value: totalWorkforce + (isHq ? HQ_WORKFORCE : 0), capacity: workforce };
	}

	static calculate(modules: StationModuleModel[], sunlight: number, partialWorkforce: number, isHq = false) {
		const work = this.calculateWorkforce(modules, isHq);

		let multiplier = work.capacity == 0 || work.value == 0 ? 0 : partialWorkforce / work.value;

		if (multiplier > 1) {
			multiplier = 1;
		}

		let data: Record<string, WareProductionData[]> = {};
		if (modules.length > 0) {
			data = modules
				.map<WareProductionData[]>((x) => {
					const module = x.module;
					if (!module) {
						return [];
					}
					let modifier = 1;
					if (module.type === 'Habitation') {
						const capacity = (module.workForce?.capacity ?? 0) * x.count;
						if (partialWorkforce >= capacity) {
							partialWorkforce -= capacity;
						} else {
							modifier = partialWorkforce / capacity;
							partialWorkforce = 0;
						}
					}

					const values: StationResourceItemModel[] = x.needs.map((y) => ({
						ware: y.ware,
						count: x.count,
						amount: -y.amount,
						efficiency: modifier * 100,
						name: module.name,
						total: x.count * -y.amount * modifier,
						type: module.type,
					}));

					if (x.production) {
						for (const production of x.production) {
							const effect = production.value.effects
								? production.value.effects.find((e) => e.type == Effects.work)
								: null;
							const perCycle = production.value.amount;
							let efficiency =
								effect == null ? 1 : StationCalculatorModel.amountPerCycle(perCycle, effect.product * multiplier) / perCycle;

							if (production.ware.id === Wares.energycells.id) {
								// add sunlight for energy cells
								let sun = parseInt(String(sunlight));
								if (isNaN(sun) || sun < 0) {
									sun = 100;
								}

								efficiency = (efficiency * sun) / 100;
							}

							values.push({
								ware: production.ware,
								count: x.count,
								amount: production.amount,
								efficiency: efficiency * 100,
								name: module.name,
								total: x.count * production.amount * efficiency,
								type: module.type,
							});
						}
					}

					return values;
				})
				.reduce((a, b) => {
					return a.concat(b);
				})
				.reduce<Record<string, WareProductionData[]>>(function (obj, item) {
					obj[item.ware.id] = obj[item.ware.id] || [];
					obj[item.ware.id].push(item);
					return obj;
				}, {});
		}

		const resources: StationResourceModel[] = [];

		for (const prop in data) {
			if (Object.hasOwn(data, prop)) {
				const values = data[prop];

				let sum = 0;
				values.forEach((x) => {
					sum += x.total;
				});

				resources.push({
					ware: values[0].ware,
					amount: sum,
					items: values,
				});
			}
		}

		return resources;
	}
}

export class StationCalculatorModel {
	/** True for the scrap recyclers: production modules making their wares with the recycling method. */
	static isRecycler(module: StationModule) {
		return module.queue?.some((x) => x.method === ProductionMethods.recycling) ?? false;
	}

	/**
	 * Wares made per cycle with the workforce bonus: the game rounds the bonus down to whole wares each cycle.
	 * @param bonus workforce bonus as a fraction, e.g. 0.43 for +43%
	 */
	static amountPerCycle(amount: number, bonus: number) {
		return amount + Math.floor(amount * bonus);
	}
}
