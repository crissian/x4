import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShareLayoutComponent } from './share-layout.component';
import * as urlon from 'urlon';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { ComponentBase } from '../../shared/components/component-base';
import { Layout, ModuleConfig } from '../../shared/services/module-config';
import { LayoutService } from '../services/layout-service';
import { SaveLayoutComponent } from './save-layout.component';
import { Message, MessageType } from '../../shared/services/message';
import { LoadLayoutComponent } from './load-layout.component';
import { Title } from '@angular/platform-browser';
import { WareService } from '../../shared/services/ware.service';
import { Ware } from '../../shared/services/model/model';

interface WareGroupData {
  name: string;
  wares: { id: string, name: string }[];
}

interface WareProductionData {
  ware: Ware;
  count: number;
  amount: number;
  efficiency: number;
  name: string;
  total: number;
}

class ProductionModel {
  private _count: number;
  private _productionId: string;
  private _wareId: string;
  private _ware: Ware;

  production: { amount: number, ware: Ware };
  needs: { amount: number, ware: Ware }[];

  constructor(private wareService: WareService, wareId: string = '', productionId: string = '', count: number = 1) {
    this._wareId = wareId;
    this._productionId = productionId;
    this._count = count;

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

    if (!value) {
      this._ware = null;
      this.productionId = '';
    } else {
      this._ware = this.wareService.getWare(value);
      if (this._ware.production.length > 0) {
        this.productionId = this._ware.production[0].method;
      } else {
        this._productionId = '';
      }
    }
  }

  get productionId() {
    return this._productionId;
  }

  set productionId(value: string) {
    if (value == this._productionId) {
      return;
    }

    this._productionId = value;

    if (value) {
      this.update();
    }
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

  private update() {
    if (this.ware == null) {
      this.production = null;
      this.needs = [];
    } else {
      const currentProduction = this.ware.production.find(x => x.method == this.productionId);
      if (currentProduction == null) {
        this.needs = [];
        this.production = null;
      } else {
        this.needs = [];

        // cycles per hour
        const cycles = 3600 / currentProduction.time;

        this.production = {amount: currentProduction.amount * cycles, ware: this.ware};
        currentProduction.wares
          .forEach(x => {
            const neededWare = this.wareService.getWare(x.ware);
            this.needs.push({amount: x.amount * cycles, ware: neededWare});
          });
      }
    }
  }
}

@Component({
  selector: 'app-station-calculator',
  templateUrl: './station-calculator.component.html'
})
export class StationCalculatorComponent extends ComponentBase implements OnInit {
  productionEfficiency = 100;
  expandState: { [resourceId: number]: boolean } = {};
  layout: Layout;
  messages: Message[] = [];
  stationModules: ProductionModel[] = [];

  wareGroups: WareGroupData[];

  constructor(private modal: NgbModal, private route: ActivatedRoute,
              private layoutService: LayoutService,
              private titleService: Title,
              private wareService: WareService) {
    super();
  }

  ngOnInit(): void {
    this.titleService.setTitle('X4:Foundations - Station Calculator');

    this.wareGroups = this.wareService.getWareGroups()
      .map(x => {
        return {
          name: x.name,
          wares: this.wareService.getWaresByGroup(x.id)
            .filter(y => y.production.length > 0)
        };
      })
      .filter(x => x.wares.length > 0);

    this.route.queryParams
      .pipe(
        takeUntil(this.onDestroy)
      )
      .subscribe(data => {
        if (data['l']) {
          try {
            const layout = data['l'].replace(/-/g, '=').replace(/,/g, '&');
            const layoutData = urlon.parse(layout);
            this.stationModules = layoutData.map(x => {
              const model = new ProductionModel(this.wareService);
              model.wareId = x.ware;
              model.count = x.count;
              if (x.prod) {
                model.productionId = x.prod;
              }
              return model;
            });
          } catch (err) {
            console.log(err);
          }
        }
      });

    if (this.stationModules.length === 0) {
      this.stationModules.push(new ProductionModel(this.wareService));
    }
  }

  get resources() {
    const data = this.stationModules
      .map<WareProductionData[]>(x => {
        const values = x.needs.map(y => {
          return {
            ware: y.ware,
            count: x.count,
            amount: -y.amount,
            efficiency: 100,
            name: x.ware.name + ' Production',
            total: x.count * -y.amount
          };
        });

        if (x.production) {
          values.push({
            ware: x.ware,
            count: x.count,
            amount: x.production.amount,
            efficiency: this.productionEfficiency,
            name: x.ware.name + ' Production',
            total: x.count * x.production.amount * this.productionEfficiency / 100
          });
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

    const results = [];

    for (const prop in data) {
      if (data.hasOwnProperty(prop)) {
        const values = <WareProductionData[]>data[prop];

        let sum = 0;
        values.forEach(x => {
          sum += x.total;
        });

        results.push({
          ware: values[0].ware,
          amount: sum,
          items: values,
          expanded: this.expandState[values[0].ware.id]
        });
      }
    }

    return results.sort((a, b) => {
      return this.wareService.compareWares(a.ware, b.ware);
    });
  }

  removeModule(item: ProductionModel) {
    const index = this.stationModules.indexOf(item);
    if (index >= 0) {
      this.stationModules.splice(index, 1);
    }
  }

  toggleExpanded(item: any) {
    item.expanded = !item.expanded;
    this.expandState[item.ware.id] = item.expanded;
  }

  addModule() {
    this.stationModules.push(new ProductionModel(this.wareService));
  }

  shareLayout() {
    const modalRef = this.modal.open(ShareLayoutComponent);
    const data = this.stationModules
      .filter(x => x.count > 0 && x.wareId)
      .map(x => {
        return {
          prod: x.productionId,
          ware: x.wareId,
          count: x.count
        };
      });
    const params = urlon.stringify(data).replace(/=/g, '-').replace(/&/g, ',');
    const url = window.location.href.split('?')[0];
    modalRef.componentInstance.url = `${url}?l=${params}`;
  }

  saveLayoutAs() {
    const modalRef = this.modal.open(SaveLayoutComponent);
    modalRef.result
      .then(res => {
        if (res) {
          this.layout = {
            name: res,
            config: this.getModuleConfig()
          };
          this.layoutService.saveLayout(this.layout);
          this.messages.push({
            type: MessageType.success,
            content: `<strong>${res}</strong> successfully saved.`
          });
        }
      });
  }

  saveLayout() {
    if (!this.layout || !this.layout.name) {
      this.saveLayoutAs();
    } else {
      this.layout.config = this.getModuleConfig();
      this.layoutService.saveLayout(this.layout);
      this.messages.push({
        type: MessageType.success,
        content: `<strong>${this.layout.name}</strong> successfully saved.`
      });
    }
  }

  loadLayout() {
    const modalRef = this.modal.open(LoadLayoutComponent);
    modalRef.result
      .then(data => {
        if (data) {
          const layout = this.layoutService.getLayout(data);
          if (layout) {
            this.layout = layout;
            this.stationModules = this.getProductionModules(layout.config);
          }
        }
      });
  }

  private getModuleConfig() {
    return this.stationModules
      .map<ModuleConfig>(x => {
        return {
          moduleId: x.wareId,
          count: x.count,
          production: x.productionId
        };
      });
  }

  getProductionModules(config: ModuleConfig[]) {
    return config.map(x => {
      const model = new ProductionModel(this.wareService);
      model.wareId = x.moduleId;
      model.count = x.count;
      if (x.production) {
        model.productionId = x.production;
      }
      return model;
    });
  }
}
