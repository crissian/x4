import { Component, Input } from '@angular/core';
import { StationModuleModel } from './station-calculator.model';

@Component({
  selector: 'app-station-summary',
  templateUrl: './station-summary.component.html'
})
export class StationSummaryComponent {
  private expandState: { [key: string]: boolean } = {};
  private _modules: StationModuleModel[];

  totalWorkforce = 0;
  totalWorkforceCapacity = 0;

  workforceNeeded: { amount: number, name: string, count: number }[] = [];
  workforceCapacity: { amount: number, name: string, count: number }[] = [];

  get modules() {
    return this._modules;
  }

  @Input()
  set modules(value: StationModuleModel[]) {
    this._modules = value;
    this.update();
  }

  update() {
    this.totalWorkforce = 0;
    this.totalWorkforceCapacity = 0;

    this.workforceNeeded = [];
    this.workforceCapacity = [];

    if (this.modules == null) {
      return;
    }

    this.modules.forEach(item => {
      if (item.module != null && item.module.workForce != null) {
        if (item.module.workForce.max != null) {
          this.totalWorkforce += item.count * item.module.workForce.max;
          this.workforceNeeded.push({ amount: item.module.workForce.max, name: item.module.name, count: item.count });
        }
        if (item.module.workForce.capacity != null) {
          this.totalWorkforceCapacity += item.count * item.module.workForce.capacity;
          this.workforceCapacity.push({ amount: item.module.workForce.capacity, name: item.module.name, count: item.count });
        }
      }
    });
  }

  toggleExpanded(key: string) {
    this.expandState[key] = !this.expandState[key];
  }
}
