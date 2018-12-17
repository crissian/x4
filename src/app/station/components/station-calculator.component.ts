import { Component, Input, OnInit } from '@angular/core';
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
import { WareGroups } from '../../shared/services/data/ware-groups-data';


@Component({
  selector: 'app-station-calculator',
  templateUrl: './station-calculator.component.html'
})
export class StationCalculatorComponent extends ComponentBase implements OnInit {
  wareGroups = WareGroups.all;

  productionEfficiency = 100;
  expandState: { [resourceId: number]: boolean } = {};
  layout: Layout;
  messages: Message[] = [];

  @Input()
  stationModules: ModuleConfig[] = [];

  constructor(private modal: NgbModal, private route: ActivatedRoute, private layoutService: LayoutService, private titleService: Title) {
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
            this.stationModules = urlon.parse(layout);
          } catch (err) {
            console.log(err);
          }
        }
      });

    if (this.stationModules.length === 0) {
      this.stationModules.push({ moduleId: '', count: 1 });
    }
  }

  get resources() {
    return [];
  }

  removeModule(item: ModuleConfig) {
    const index = this.stationModules.indexOf(item);
    if (index >= 0) {
      this.stationModules.splice(index, 1);
    }
  }

  toggleExpanded(item: any) {
    item.expanded = !item.expanded;
    this.expandState[item.resource.id] = item.expanded;
  }

  addModule() {
    this.stationModules.push({moduleId: '', count: 1});
  }

  shareLayout() {
    const modalRef = this.modal.open(ShareLayoutComponent);
    const params = urlon.stringify(this.stationModules.filter(x => x.count > 0 && x.moduleId)).replace(/=/g, '-').replace(/&/g, ',');
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
            config: this.stationModules
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
      this.layout.config = this.stationModules;
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
            this.stationModules = layout.config;
          }
        }
      });
  }
}
