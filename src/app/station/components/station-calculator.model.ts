import { StationModule, Ware } from '../../shared/services/model/model';
import { ProductionService } from '../services/production.service';


export interface WareGroupData {
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

export interface StationModelData {
  wareId?: string;
  productionId?: string;
  count?: number;
}

export class ProductionModel {
  private static defaultValues = { wareId: '', count: 1, productionId: ''};

  private _count: number;
  private _productionId: string;
  private _wareId: string;
  private _ware: Ware;

  production: { amount: number, ware: Ware };
  needs: { amount: number, ware: Ware }[];
  module: StationModule;

  constructor(private service: ProductionService, data?: StationModelData) {
    data = { ...ProductionModel.defaultValues, ...data };
    this._wareId = data.wareId || '';
    this._productionId = data.productionId || '';
    this._count = data.count == null ? 1 : data.count;

    this.updateWare();
    this.update();
  }

  get wareId() {
    return this._wareId;
  }

  set wareId(value: string) {
    if (value == this._wareId) {
      return;
    }

    this._wareId = value;

    this.updateWare();
  }

  get productionId() {
    return this._productionId;
  }

  set productionId(value: string) {
    if (value == this._productionId) {
      return;
    }

    this._productionId = value;
    this.update();
  }

  get count() {
    return this._count;
  }

  set count(value: number) {
    if (this._count != value) {
      this._count = value;
      this.update();
    }
  }

  get ware() {
    return this._ware;
  }

  private updateWare() {
    if (!this._wareId) {
      this.module = null;
      this.productionId = '';
    } else {
      this._ware = this.service.getWare(this._wareId);
      if (this._ware.production.length > 0) {
        this.productionId = this._ware.production[0].method;
      } else {
        this._productionId = '';
      }
    }
  }

  private update() {
    if (this.ware == null) {
      this.production = null;
      this.needs = [];
      this.module = null;
    } else {
      const currentProduction = this.ware.production.find(x => x.method == this.productionId);
      if (currentProduction == null) {
        this.needs = [];
        this.production = null;
        this.module = null;
      } else {
        this.module = this.service.getModuleByWare(this.wareId, this.productionId);
        this.needs = [];

        // cycles per hour
        const cycles = 3600 / currentProduction.time;

        this.production = {amount: currentProduction.amount * cycles, ware: this.ware};
        currentProduction.wares
          .forEach(x => {
            const neededWare = this.service.getWare(x.ware);
            this.needs.push({amount: x.amount * cycles, ware: neededWare});
          });
      }
    }
  }
}
