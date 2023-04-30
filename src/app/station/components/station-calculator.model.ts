import { ModuleWorker, Production, StationModule, Ware } from '../../shared/services/model/model';
import { WareService } from '../../shared/services/ware.service';
import { ModuleService } from '../../shared/services/module.service';
import { ModuleTypes } from '../../shared/services/data/module-types-data';
import { ProductionMethods } from '../../shared/services/data/production-method-data';
import { Workers } from '../../shared/services/data/workers-data';
import { Effects } from '../../shared/services/data/effects-data';
import { Wares } from "../../shared/services/data/wares-data";

export const RECYCLING_MODULES = [ 'module_gen_prod_scrap_recycler', 'module_ter_prod_scrap_recycler' ];

export interface StationResourceItemModel {
    ware: Ware;
    count: number;
    amount: number;
    efficiency: number;
    name: string;
    total: number;
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
}

export interface StationProduction {
    amount: number;
    ware: Ware;
    value: Production;
}

export class StationModuleModel {
    module: StationModule;
    needs: { amount: number, ware: Ware }[];
    production: StationProduction[];

    private _count: number;
    private _moduleId: string;

    constructor(private wareService: WareService, private moduleService: ModuleService, moduleId: string = '', count: number = 1) {
        this.moduleId = moduleId;
        this.count = count;
    }

    get moduleId() {
        return this._moduleId;
    }

    set moduleId(value: string) {
        if (value != this._moduleId) {
            this._moduleId = value;
            this.update();
        }
    }

    get count() {
        return this._count;
    }

    set count(value: number) {
        if (value != this._count) {
            this._count = value;
            this.update();
        }
    }

    private update() {
        if (!this._moduleId) {
            this.module = null;
            this.production = null;
            this.needs = [];
        } else {
            this.module = this.moduleService.getEntity(this.moduleId);
            this.needs = [];
            this.production = [];

            if (this.module.type == ModuleTypes.production) {
                const wares = this.module.product;

                for (let ware of wares) {
                    let currentProd: Production = null;

                    if (RECYCLING_MODULES.includes(this.module.id)) {
                        currentProd = ware.production.find(x => x.method == ProductionMethods.recycling);
                    }

                    if (currentProd == null) {
                        if (this.module.makerRace == null) {
                            currentProd = ware.production.find(x => x.method == ProductionMethods.default);
                        } else {
                            currentProd = ware.production.find(x => x.method == this.module.makerRace.id) ||
                                ware.production.find(x => x.method == ProductionMethods.default);
                        }
                    }

                    // cycles per hour
                    const cycles = 3600 / currentProd.time;

                    this.production.push({ amount: currentProd.amount * cycles, ware: ware, value: currentProd });
                    currentProd.wares
                        .forEach(x => {
                            const neededWare = this.wareService.getEntity(x.ware);
                            this.needs.push({ amount: x.amount * cycles, ware: neededWare });
                        });
                }
            } else if (this.module.type == ModuleTypes.habitation) {
                const capacity = this.module.workForce.capacity;
                const worker: ModuleWorker = Workers.get(this.module.workForce.race.id);

                worker.consumption.forEach(x => {
                    this.needs.push({ amount: x.amount * capacity / worker.amount, ware: x.ware });
                });
            }
        }
    }
}

export class ResourceCalculator {
    static calculateWorkforce(modules: StationModuleModel[]) {
        let totalWorkforce = modules.reduce((acc, item) => {
            if (item.module && item.module.workForce && item.module.workForce.max) {
                return acc + item.count * item.module.workForce.max;
            }
            return acc;
        }, 0);

        let workforce = modules.reduce((acc, item) => {
            if (item.module && item.module.workForce && item.module.workForce.capacity) {
                return acc + item.count * item.module.workForce.capacity;
            }
            return acc;
        }, 0);

        return { value: totalWorkforce, capacity: workforce };
    }

    static calculate(modules: StationModuleModel[], sunlight: number) {
        let work = this.calculateWorkforce(modules);

        let multiplier = (work.capacity == 0 || work.value == 0) ? 0 : (work.capacity / work.value);
        if (multiplier > 1) {
            multiplier = 1;
        }

        let data = {};
        if (modules.length > 0) {
            data = modules
                .map<WareProductionData[]>(x => {
                    const values: StationResourceItemModel[] = x.needs
                        .map(y => ({
                                ware: y.ware,
                                count: x.count,
                                amount: -y.amount,
                                efficiency: 100,
                                name: x.module.name,
                                total: x.count * -y.amount
                            })
                        );

                    if (x.production) {
                        for (let production of x.production) {
                            const effect = production.value.effects ? production.value.effects.find(e => e.type == Effects.work) : null;
                            let efficiency = effect == null ? 1 : (1 + effect.product * multiplier);

                            if (production.ware.id === Wares.energycells.id) {
                                // add sunlight for energy cells
                                let sun = parseInt(sunlight as any);
                                if (isNaN(sun) || sun < 0) {
                                    sun = 100;
                                }

                                efficiency = efficiency * sun / 100;
                            }

                            values.push({
                                ware: production.ware,
                                count: x.count,
                                amount: production.amount,
                                efficiency: efficiency * 100,
                                name: x.module.name,
                                total: x.count * production.amount * efficiency
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
                values.forEach(x => {
                    sum += x.total;
                });

                resources.push({
                    ware: values[0].ware,
                    amount: sum,
                    items: values
                });
            }
        }

        return resources;
    }
}
