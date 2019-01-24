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
import { LoadLayoutComponent, LoadLayoutResult, LoadLayoutType } from './load-layout.component';
import { Title } from '@angular/platform-browser';
import { WareService } from '../../shared/services/ware.service';
import { ModuleService } from '../../shared/services/module.service';
import { StationModuleModel } from './station-calculator.model';
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
      this.titleService.setTitle('X4: Foundations - Station Calculator');

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

      const current = this.layoutService.getCurrentLayout();
      if (current) {
         this.loadLayoutInternal(current);
         if (current.name != null) {
            this.layout = current;
         }
      }

      if (this.modules.length === 0) {
         this.modules.push(new StationModuleModel(this.wareService, this.moduleService));
      }
   }

   onChange() {
      this.components.forEach(x => {
         x.update();
      });

      this.saveCurrentLayout();
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
                  provideAllResources: this.summaryComponent.provideAllResources,
                  isHeadquarters: this.summaryComponent.isHq,
                  config: this.getModuleConfig()
               };
               this.layoutService.saveLayout(this.layout);
               this.messages.push({
                  type: MessageType.success,
                  content: `<strong>${res}</strong> successfully saved.`
               });
               this.layoutService.saveCurrentLayout(this.layout);
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
         this.layout.provideAllResources = this.summaryComponent.provideAllResources;
         this.layout.isHeadquarters = this.summaryComponent.isHq;
         this.layoutService.saveLayout(this.layout);
         this.messages.push({
            type: MessageType.success,
            content: `<strong>${this.layout.name}</strong> successfully saved.`
         });
         this.layoutService.saveCurrentLayout(this.layout);
      }
   }

   newLayout() {
      this.layout = {
         name: null,
         config: [
            { moduleId: '', count: 1 }
         ]
      };
      this.loadLayoutInternal(this.layout);
      this.layoutService.saveCurrentLayout(this.layout);
   }

   loadLayout() {
      const modalRef = this.modal.open(LoadLayoutComponent);
      modalRef.result
         .then((data: LoadLayoutResult) => {
            if (data) {
               const layout = this.layoutService.getLayout(data.layoutName);
               if (layout) {
                  if (data.type == LoadLayoutType.load) {
                     this.layout = layout;
                     this.loadLayoutInternal(layout);
                     this.layoutService.saveCurrentLayout(layout);
                  } else if (data.type == LoadLayoutType.add) {
                     const existingModules = this.modules.concat([]);

                     const modules = this.getModules(layout.config);
                     modules.forEach(x => {
                        const existing = existingModules.find(m => m.moduleId == x.moduleId);
                        if (existing == null) {
                           existingModules.push(x);
                        } else {
                           existing.count += x.count;
                        }
                     });
                     this.modules = existingModules;
                  }
               }
            }
         });
   }

   saveCurrentLayout() {
      const current = this.getCurrentLayout();
      this.layoutService.saveCurrentLayout(current);
   }

   private getCurrentLayout() {
      return {
         name: this.layout == null ? null : this.layout.name,
         resourcesPrice: this.summaryComponent.resourcesPrice,
         productsPrice: this.summaryComponent.productsPrice,
         modulesResourcesPrice: this.summaryComponent.modulesResourcesPrice,
         provideBasicResources: this.summaryComponent.provideBasicResources,
         provideAllResources: this.summaryComponent.provideAllResources,
         isHeadquarters: this.summaryComponent.isHq,
         config: this.getModuleConfig()
      };
   }

   private loadLayoutInternal(layout: Layout) {
      this.modules = this.getModules(layout.config);
      this.summaryComponent.productsPrice = layout.productsPrice == null ? 50 : layout.productsPrice;
      this.summaryComponent.modulesResourcesPrice = layout.modulesResourcesPrice == null ? 50 : layout.modulesResourcesPrice;
      this.summaryComponent.resourcesPrice = layout.resourcesPrice == null ? 50 : layout.resourcesPrice;
      this.summaryComponent.provideBasicResources = layout.provideBasicResources;
      this.summaryComponent.provideAllResources = layout.provideAllResources;
      this.summaryComponent.isHq = layout.isHeadquarters;
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

   private getModules(config: ModuleConfig[]) {
      return config.map(x => {
         return new StationModuleModel(this.wareService, this.moduleService, x.moduleId, x.count);
      });
   }
}
