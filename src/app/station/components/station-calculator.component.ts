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
import { ModuleService } from '../../shared/services/module.service';
import { ProductionService } from '../services/production.service';
import { ProductionModel, WareGroupData, WareProductionData } from './station-calculator.model';
import { StationModule } from '../../shared/services/model/model';
import { ModuleTypes } from '../../shared/services/data/module-types-data';
import { StationModuleModel } from './model';


@Component({
  selector: 'app-station-calculator',
  templateUrl: './station-calculator.component.html'
})
export class StationCalculatorComponent extends ComponentBase implements OnInit {
  productionEfficiency = 100;
  expandState: { [resourceId: number]: boolean } = {};
  layout: Layout;
  messages: Message[] = [];
  stationModules: StationModuleModel[] = [];

  wareGroups: WareGroupData[];

  constructor(private modal: NgbModal, private route: ActivatedRoute,
              private layoutService: LayoutService,
              private titleService: Title,
              private wareService: WareService,
              private moduleService: ModuleService,
              private productionService: ProductionService) {
    super();
  }

  ngOnInit(): void {
    this.titleService.setTitle('X4:Foundations - Station Calculator');

    const groupsObj = this.moduleService.getModulesByType(ModuleTypes.production)
      .reduce((obj, item: StationModule) => {
        obj[item.product.group.id] = obj[item.product.group.id] || { name: item.product.group.name, group: item.product.group, modules: [] };
        obj[item.product.group.id].modules.push(item);
        return obj;
      }, []);

    this.wareGroups = Object.keys(groupsObj)
      .map(x => groupsObj[x])
      .sort((a, b) => this.wareService.compareGroups(a.group, b.group));

    this.wareGroups.push({ name: ModuleTypes.habitation.name, modules: this.moduleService.getModulesByType(ModuleTypes.habitation) });
    this.wareGroups.push({ name: ModuleTypes.dockarea.name, modules: this.moduleService.getModulesByType(ModuleTypes.dockarea) });
    this.wareGroups.push({ name: ModuleTypes.pier.name, modules: this.moduleService.getModulesByType(ModuleTypes.pier) });
    this.wareGroups.push({ name: ModuleTypes.storage.name, modules: this.moduleService.getModulesByType(ModuleTypes.storage) });

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
              return new ProductionModel(this.productionService, { wareId: x.ware, productionId: x.prod, count: x.count });
            });
          } catch (err) {
            console.log(err);
          }
        }
      });

    if (this.stationModules.length === 0) {
      this.stationModules.push(new StationModuleModel(this.wareService, this.moduleService));
    }
  }

  get resources() {
    let data = {};
    if (this.stationModules.length > 0) {
      data = this.stationModules
        .map<WareProductionData[]>(x => {
          const values = x.needs.map(y => {
            return {
              ware: y.ware,
              count: x.count,
              amount: -y.amount,
              efficiency: 100,
              name: x.module.name,
              total: x.count * -y.amount
            };
          });

          if (x.production) {
            values.push({
              ware: x.production.ware,
              count: x.count,
              amount: x.production.amount,
              efficiency: this.productionEfficiency,
              name: x.module.name,
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
    }

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

    let totalMin = 0;
    let totalMax = 0;
    let totalAvg = 0;

    results.forEach(x => {
      totalMin += x.amount * x.ware.price.min;
      totalMax += x.amount * x.ware.price.max;
      totalAvg += x.amount * x.ware.price.avg;
    });

    return {
      wares: results.sort((a, b) => this.wareService.compareWares(a.ware, b.ware)),
      totalMin: totalMin,
      totalMax: totalMax,
      totalAvg: totalAvg,
    };
  }

  removeModule(item: StationModuleModel) {
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
    this.stationModules.push(new StationModuleModel(this.wareService, this.moduleService));
  }

  shareLayout() {
    const modalRef = this.modal.open(ShareLayoutComponent);
    const data = this.stationModules
      .filter(x => x.count > 0 && x.moduleId)
      .map(x => {
        return {
          module: x.moduleId,
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
          moduleId: x.moduleId,
          count: x.count
        };
      });
  }

  getProductionModules(config: ModuleConfig[]) {
    return config.map(x => {
      const model = new StationModuleModel(this.wareService, this.moduleService, x.moduleId, x.count);
      return model;
    });
  }

  getTotalWorkforce() {
    let total = 0;
    this.stationModules.forEach(x => {
      if (x.module != null && x.module.workForce != null && x.module.workForce.max != null) {
        total += x.count * x.module.workForce.max;
      }
    });
    return total;
  }
}
