import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WareGroups } from '../../../shared/services/data/ware-groups-data';
import { WareService } from '../../../shared/services/ware.service';
import { ResourceCalculator, StationModuleModel } from '../station-calculator.model';
import { ResourcePriceType } from './enums/resource-price-type.enum';
import { ResourceAmount } from './interfaces/resource-amount';
import { ModuleCost } from './models/module-cost';
import { ModuleCostItem } from './models/module-cost-item';
import { ResourceSummary } from './models/resource-summary';
import { StationSummaryService } from './services/station-summary.service';

/**
 * The Station Summary component
 */
@Component({
	selector: 'app-station-summary',
	templateUrl: './station-summary.component.html',
})
export class StationSummaryComponent {
	static basicResources = [WareGroups.gases, WareGroups.minerals, WareGroups.ice];

	expandState: { [key: string]: boolean } = {};
	private _modules: StationModuleModel[];

	provideBasicResources = false;
	provideAllResources = false;
	isHq = false;
	resourcesPrice = 50;
	productsPrice = 50;
	modulesResourcesPrice = 50;

	private _totalWorkforce = 0;
	totalWorkforceCapacity = 0;
	partialWorkforce = 0;

	workforceNeeded: { amount: number; name: string; count: number }[] = [];
	workforceCapacity: { amount: number; name: string; count: number }[] = [];

	resourcesNeeded: ResourceSummary[] = [];
	resourcesProduced: ResourceSummary[] = [];
	moduleCosts: ModuleCost[];

	totalModuleResourceCosts: ResourceAmount[] = [];

	@Output()
	change = new EventEmitter();

	constructor(private wareService: WareService, private stationSummaryService: StationSummaryService) {}

	get modules() {
		return this._modules;
	}

	@Input()
	set modules(value: StationModuleModel[]) {
		this._modules = value;
		this.update();
	}

	get totalWorkforce() {
		return this._totalWorkforce + (this.isHq ? 200 : 0);
	}

	onChange() {
		this.update();
		this.change.emit();
	}

	update() {
		this._totalWorkforce = 0;

		this.workforceNeeded = [];
		this.workforceCapacity = [];

		this.resourcesNeeded = [];
		this.resourcesProduced = [];
		this.moduleCosts = [];

		if (this.modules == null) {
			return;
		}

		this.modules.forEach((item) => {
			if (item.module != null && item.module.workForce != null) {
				if (item.module.workForce.max != null) {
					this._totalWorkforce += item.count * item.module.workForce.max;
					this.workforceNeeded.push({
						amount: item.module.workForce.max,
						name: item.module.name,
						count: item.count,
					});
				}
				if (item.module.workForce.capacity != null) {
					this.workforceCapacity.push({
						amount: item.module.workForce.capacity,
						name: item.module.name,
						count: item.count,
					});
				}
			}
			if (item.module != null) {
				const cost = this.getModuleCost(item);
				if (cost != null) {
					this.moduleCosts.push(cost);
				}
			}
		});
		
		let workforce = this.modules.reduce((acc, item) => {
			if (item.module && item.module.workForce && item.module.workForce.capacity) {
				return acc + item.count * item.module.workForce.capacity;
			}
			return acc;
		}, 0);
		if (this.totalWorkforceCapacity != workforce) {
			this.totalWorkforceCapacity = workforce;
			this.partialWorkforce = workforce;
		}
		this.stationSummaryService.setPartialWorkforce(this.partialWorkforce);

		const resources = ResourceCalculator.calculate(this.modules, this._totalWorkforce, this.partialWorkforce);
		resources.sort((a, b) => this.wareService.compareWares(a.ware, b.ware));

		resources.forEach((x) => {
			if (x.amount < 0) {
				let warePrice: number = null;
				if (this.provideAllResources) {
					warePrice = 0;
				} else if (
					this.provideBasicResources &&
					StationSummaryComponent.basicResources.indexOf(x.ware.group) >= 0
				) {
					warePrice = 0;
				}
				const model = new ResourceSummary(x, this, ResourcePriceType.expense, warePrice);
				this.resourcesNeeded.push(model);
			} else if (x.amount > 0) {
				const model = new ResourceSummary(x, this, ResourcePriceType.product);
				this.resourcesProduced.push(model);
			}
		});

		this.totalModuleResourceCosts = [];

		this.moduleCosts.forEach((cost) => {
			cost.items.forEach((item) => {
				let resourceCost = this.totalModuleResourceCosts.find((x) => x.ware.id == item.ware.id);
				if (resourceCost == null) {
					resourceCost = {
						ware: item.ware,
						value: cost.count * item.amount,
					};
					this.totalModuleResourceCosts.push(resourceCost);
				} else {
					resourceCost.value += cost.count * item.amount;
				}
			});
		});
	}

	get totalExpenses() {
		let totalExpenses = 0;

		this.resourcesNeeded.forEach((x) => {
			totalExpenses += x.amount * x.price;
		});

		return totalExpenses;
	}

	get totalProfits() {
		let totalProfits = 0;

		this.resourcesProduced.forEach((x) => {
			totalProfits += x.amount * x.price;
		});

		return totalProfits;
	}

	get totalModuleCost() {
		let total = 0;

		this.moduleCosts.forEach((x) => {
			total += x.price;
		});

		return total;
	}

	private getModuleCost(item: StationModuleModel) {
		const production = item.module.production[0];
		if (!production) {
			return null;
		}

		let totalMin = 0;
		let totalMax = 0;

		const items: ModuleCostItem[] = [];
		production.wares.forEach((x) => {
			const ware = this.wareService.getEntity(x.ware);
			totalMin += ware.price.min * x.amount;
			totalMax += ware.price.max * x.amount;

			items.push(new ModuleCostItem(ware, x.amount, this));
		});

		return new ModuleCost(item, this, totalMin, totalMax, items);
	}

	toggleExpanded(key: string) {
		this.expandState[key] = !this.expandState[key];
	}
}
