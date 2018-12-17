import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShareLayoutComponent } from './share-layout.component';
import * as urlon from 'urlon';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { ComponentBase } from '../../shared/components/component-base';
import { Layout } from '../../shared/services/module-config';
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

class ProductionModel {
  count: number;
  productionId: string;
  ware: Ware;

  constructor(private wareService: WareService) {
    this.count = 1;
  }

  get wareId() {
    return this.ware == null ? '' : this.ware.id;
  }

  set wareId(value: string) {
    if (!value) {
      this.ware = null;
    } else {
      this.ware = this.wareService.getWare(value);
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
            this.stationModules = urlon.parse(layout);
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
    return [];
  }

  removeModule(item: ProductionModel) {
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
    this.stationModules.push(new ProductionModel(this.wareService));
  }

  shareLayout() {
    const modalRef = this.modal.open(ShareLayoutComponent);
    const params = urlon.stringify(this.stationModules.filter(x => x.count > 0 && x.wareId)).replace(/=/g, '-').replace(/&/g, ',');
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
            // this.stationModules = layout.config;
          }
        }
      });
  }
}
