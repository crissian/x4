import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
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
import { StationModuleModel} from './station-calculator.model';
import { StationSummaryComponent } from './station-summary.component';

interface Updatable {
  update();
}

@Component({
  selector: 'app-station-calculator',
  templateUrl: './station-calculator.component.html'
})
export class StationCalculatorComponent extends ComponentBase implements OnInit {
  layout: Layout;
  messages: Message[] = [];
  modules: StationModuleModel[] = [];

  @ViewChildren('stationResources,stationSummary')
  components: QueryList<Updatable>;

  @ViewChild(StationSummaryComponent) summaryComponent: StationSummaryComponent;

  constructor(private modal: NgbModal, private route: ActivatedRoute,
              private layoutService: LayoutService,
              private titleService: Title,
              private wareService: WareService,
              private moduleService: ModuleService) {
    super();
  }

  ngOnInit(): void {
    this.titleService.setTitle('X4:Foundations - Station Calculator');

    this.route.queryParams
      .pipe(
        takeUntil(this.onDestroy)
      )
      .subscribe(data => {
        if (data['l']) {
          try {
            const layout = data['l'].replace(/-/g, '=').replace(/,/g, '&');
            const layoutData = urlon.parse(layout);
            this.modules = layoutData.map(x => {
              return new StationModuleModel(this.wareService, this.moduleService, x.module, x.count);
            });
          } catch (err) {
            console.log(err);
          }
        }
      });

    if (this.modules.length === 0) {
      this.modules.push(new StationModuleModel(this.wareService, this.moduleService));
    }
  }

  onChange() {
    this.components.forEach(x => {
      x.update();
    });
  }

  shareLayout() {
    const modalRef = this.modal.open(ShareLayoutComponent);
    const data = this.modules
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
            resourcesPrice: this.summaryComponent.resourcesPrice,
            productsPrice: this.summaryComponent.productsPrice,
            modulesResourcesPrice: this.summaryComponent.modulesResourcesPrice,
            provideBasicResources: this.summaryComponent.provideBasicResources,
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
      this.layout.resourcesPrice = this.summaryComponent.resourcesPrice;
      this.layout.productsPrice = this.summaryComponent.productsPrice;
      this.layout.modulesResourcesPrice = this.summaryComponent.modulesResourcesPrice;
      this.layout.provideBasicResources = this.summaryComponent.provideBasicResources;

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
            this.modules = this.getModules(layout.config);

            this.summaryComponent.productsPrice = layout.productsPrice == null ? 50 : layout.productsPrice;
            this.summaryComponent.modulesResourcesPrice = layout.modulesResourcesPrice == null ? 50 : layout.modulesResourcesPrice;
            this.summaryComponent.resourcesPrice = layout.resourcesPrice == null ? 50 : layout.resourcesPrice;
          }
        }
      });
  }

  private getModuleConfig() {
    return this.modules
      .map<ModuleConfig>(x => {
        return {
          moduleId: x.moduleId,
          count: x.count
        };
      });
  }

  getModules(config: ModuleConfig[]) {
    return config.map(x => {
      return new StationModuleModel(this.wareService, this.moduleService, x.moduleId, x.count);
    });
  }
}
