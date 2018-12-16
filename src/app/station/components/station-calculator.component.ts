import { Component, Input, OnInit } from '@angular/core';
import { Module, ModuleDefinition } from '../../shared/services/module';
import { Resource } from '../../shared/services/resource';
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

interface ModuleResourceOutput {
  module: ModuleDefinition;
  count: number;
}

interface ModuleResourceData {
  moduleName: string;
  count: number;
  value: number;
}

class ResourceOutput {
  private modules: ModuleResourceOutput[] = [];
  expanded = false;

  constructor(public resource: Resource) {
  }

  addModuleResource(module: ModuleDefinition, count: number) {
    this.modules.push({module: module, count: count});
  }

  get moduleResources() {
    const result: ModuleResourceData[] = [];

    this.modules.forEach(x => {
      if (x.module.production != null && x.module.production.resource.id === this.resource.id) {
        result.push({count: x.count, moduleName: x.module.name, value: x.module.production.value});
      }

      const requirement = x.module.requirements.find(r => r.resource.id === this.resource.id);
      if (requirement != null) {
        result.push({count: x.count, moduleName: x.module.name, value: -requirement.value});
      }
    });

    return result;
  }

  get amount() {
    let amount = 0;

    this.modules.forEach(x => {
      if (x.module.production != null && x.module.production.resource.id === this.resource.id) {
        amount += x.count * x.module.production.value;
      }

      const requirement = x.module.requirements.find(r => r.resource.id === this.resource.id);
      if (requirement != null) {
        amount -= x.count * requirement.value;
      }
    });

    return amount;
  }
}

@Component({
  selector: 'app-station-calculator',
  templateUrl: './station-calculator.component.html'
})
export class StationCalculatorComponent extends ComponentBase implements OnInit {
  modules = {
    basicResources: Module.basicResources,
    basicFood: Module.basicFood,
    finalFood: Module.finalFood,
    illegal: Module.illegal,
    basicIntermediate: Module.basicIntermediate,
    intermediateGoods: Module.intermediateGoods,
    finalGoods: Module.finalGoods
  };

  expandState: { [resourceId: number]: boolean } = {};
  layout: Layout;
  messages: Message[] = [];

  @Input()
  stationModules: ModuleConfig[] = [];

  constructor(private modal: NgbModal, private route: ActivatedRoute, private layoutService: LayoutService) {
    super();
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        takeUntil(this.onDestroy)
      )
      .subscribe(data => {
        if (data['l']) {
          try {
            const layout = data['l'].replace(/-/g, '=').replace(/,/g, '&');
            this.stationModules = urlon.parse(layout);
          } catch (err) {
            console.log(err);
          }
        }
      });

    if (this.stationModules.length === 0) {
      this.stationModules.push({moduleId: 0, count: 0});
    }
  }

  get resources() {
    const resources: ResourceOutput[] = [];

    this.stationModules.forEach(x => {
      if (x.moduleId !== 0 && x.count > 0) {
        const module = Module.get(x.moduleId);
        if (module != null) {
          module.requirements.forEach(r => {
            let resource = resources.find(y => y.resource.id === r.resource.id);

            if (resource == null) {
              resource = new ResourceOutput(r.resource);
              resource.expanded = this.expandState[r.resource.id] || false;
              resources.push(resource);
            }

            resource.addModuleResource(module, x.count);
          });

          if (module.production != null) {
            let resource = resources.find(y => y.resource.id === module.production.resource.id);

            if (resource == null) {
              resource = new ResourceOutput(module.production.resource);
              resource.expanded = this.expandState[module.production.resource.id] || false;
              resources.push(resource);
            }

            resource.addModuleResource(module, x.count);
          }
        }
      }
    });

    resources.sort((x, y) => x.resource.id - y.resource.id);
    return resources;
  }

  removeModule(item: ModuleConfig) {
    const index = this.stationModules.indexOf(item);
    if (index >= 0) {
      this.stationModules.splice(index, 1);
    }
  }

  toggleExpanded(item: ResourceOutput) {
    item.expanded = !item.expanded;
    this.expandState[item.resource.id] = item.expanded;
  }

  addModule() {
    this.stationModules.push({moduleId: 0, count: 0});
  }

  shareLayout() {
    const modalRef = this.modal.open(ShareLayoutComponent);
    const params = urlon.stringify(this.stationModules.filter(x => x.count > 0 && x.moduleId != 0)).replace(/=/g, '-').replace(/&/g, ',');
    const url = window.location.href.split('?')[0];
    modalRef.componentInstance.url = `${url}?l=${params}`;
  }

  saveLayout() {
    if (!this.layout || !this.layout.name) {
      const modalRef = this.modal.open(SaveLayoutComponent);
      modalRef.result
        .then(res => {
          if (res) {
            this.layout = {
              name: res,
              config: this.stationModules
            };
            this.layoutService.saveLayout(this.layout);
            this.messages.push({
              type: MessageType.success,
              content: `<strong>${res}</strong> successfully saved.`
            });
          }
        });
    } else {
      this.layout.config = this.stationModules;
      this.layoutService.saveLayout(this.layout);
      this.messages.push({
        type: MessageType.success,
        content: `<strong>${this.layout.name}</strong> successfully saved.`
      });
    }
  }

  loadLayout() {
    this.modal.open(LoadLayoutComponent);
  }
}
