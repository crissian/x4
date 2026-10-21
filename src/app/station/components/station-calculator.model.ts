import { ModuleWorker, Production, StationModule, Ware } from '../../shared/services/model/model';
import { WareService } from '../../shared/services/ware.service';
import { ModuleService } from '../../shared/services/module.service';
import { ModuleTypes } from '../../shared/services/data/module-types-data';
import { ProductionMethods } from '../../shared/services/data/production-method-data';
import { Workers } from '../../shared/services/data/workers-data';
import { Effects } from '../../shared/services/data/effects-data';
import { Wares } from '../../shared/services/data/wares-data';

export const RECYCLING_MODULES = ['module_gen_prod_scrap_recycler', 'module_ter_prod_scrap_recycler'];

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
			for (const ware of module.product ?? []) {
				const production = this.productionOf(module, ware);
				if (!production) {
					continue;
				}

				// cycles per hour
				const cycles = 3600 / production.time;

				this.production.push({ amount: production.amount * cycles, ware, value: production });
				for (const x of production.wares) {
					const neededWare = this.wareService.getEntity(x.ware);
					if (neededWare) {
						this.needs.push({ amount: x.amount * cycles, ware: neededWare });
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

	/** Recyclers use the recycling method, race specific modules their race method, the rest the default one. */
	private productionOf(module: StationModule, ware: Ware): Production | undefined {
		const productions = ware.production ?? [];
		const byMethod = (method: string) => productions.find((x) => x.method == method);
		if (RECYCLING_MODULES.includes(module.id)) {
			const recycling = byMethod(ProductionMethods.recycling);
			if (recycling) {
				return recycling;
			}
		}
		return (module.makerRace && byMethod(module.makerRace.id)) || byMethod(ProductionMethods.default);
	}
}

export class ResourceCalculator {
	static calculateWorkforce(modules: StationModuleModel[]) {
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

		return { value: totalWorkforce, capacity: workforce };
	}

	static calculate(modules: StationModuleModel[], sunlight: number, partialWorkforce: number) {
		const work = this.calculateWorkforce(modules);

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
							let efficiency = effect == null ? 1 : 1 + effect.product * multiplier;

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
