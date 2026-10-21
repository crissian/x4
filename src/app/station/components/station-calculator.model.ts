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
	type: String;
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
	type: String;
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
	readonly module: StationModule = null;
	readonly needs: { amount: number; ware: Ware }[] = [];
	readonly production: StationProduction[] = null;

	constructor(
		private wareService: WareService,
		private moduleService: ModuleService,
		readonly moduleId: string = '',
		readonly count: number = 1
	) {
		if (!moduleId) {
			return;
		}

		this.module = this.moduleService.getEntity(moduleId);
		if (this.module == null) {
			return;
		}

		this.production = [];

		if (this.module.type == ModuleTypes.production) {
			const wares = this.module.product;

			for (let ware of wares) {
				let currentProd: Production = null;

				if (RECYCLING_MODULES.includes(this.module.id)) {
					currentProd = ware.production.find((x) => x.method == ProductionMethods.recycling);
				}

				if (currentProd == null) {
					if (this.module.makerRace == null) {
						currentProd = ware.production.find((x) => x.method == ProductionMethods.default);
					} else {
						currentProd =
							ware.production.find((x) => x.method == this.module.makerRace.id) ||
							ware.production.find((x) => x.method == ProductionMethods.default);
					}
				}

				// cycles per hour
				const cycles = 3600 / currentProd.time;

				this.production.push({ amount: currentProd.amount * cycles, ware: ware, value: currentProd });
				currentProd.wares.forEach((x) => {
					const neededWare = this.wareService.getEntity(x.ware);
					this.needs.push({ amount: x.amount * cycles, ware: neededWare });
				});
			}
		} else if (this.module.type == ModuleTypes.habitation) {
			const capacity = this.module.workForce.capacity;
			const worker: ModuleWorker = Workers.get(this.module.workForce.race.id);

			worker.consumption.forEach((x) => {
				this.needs.push({ amount: (x.amount * capacity) / worker.amount, ware: x.ware });
			});
		}
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
		let work = this.calculateWorkforce(modules);

		let multiplier = work.capacity == 0 || work.value == 0 ? 0 : partialWorkforce / work.value;

		if (multiplier > 1) {
			multiplier = 1;
		}

		let data = {};
		if (modules.length > 0) {
			data = modules
				.map<WareProductionData[]>((x) => {
					let modifier = 1;
					if (x.module?.type === 'Habitation') {
						let capacity = x.module.workForce.capacity * x.count;
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
						name: x.module.name,
						total: x.count * -y.amount * modifier,
						type: x.module.type,
					}));

					if (x.production) {
						for (let production of x.production) {
							const effect = production.value.effects
								? production.value.effects.find((e) => e.type == Effects.work)
								: null;
							let efficiency = effect == null ? 1 : 1 + effect.product * multiplier;

							if (production.ware.id === Wares.energycells.id) {
								// add sunlight for energy cells
								let sun = parseInt(sunlight as any);
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
								name: x.module.name,
								total: x.count * production.amount * efficiency,
								type: x.module.type,
							});
						}
					}

					return values;
				})
				.reduce((a, b) => {
					return a.concat(b);
				})
				.reduce(function (obj, item) {
					obj[item.ware.id] = obj[item.ware.id] || [];
					obj[item.ware.id].push(item);
					return obj;
				}, {});
		}

		const resources: StationResourceModel[] = [];

		for (const prop in data) {
			if (data.hasOwnProperty(prop)) {
				const values = <WareProductionData[]>data[prop];

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
