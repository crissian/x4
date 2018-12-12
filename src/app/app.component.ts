import { Component, OnInit } from '@angular/core';
import { Module } from '../services/module';
import { Resource } from '../services/resource';

interface ModuleConfig {
  moduleId?: number;
  count: number;
}

interface ResourceOutput {
  resource: Resource;
  amount: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'X4';
  stationModules: ModuleConfig[] = [];
  modules = Module.all;

  ngOnInit(): void {
    this.stationModules.push({ moduleId: 0, count: 0 });
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
              resource = { amount: 0, resource: r.resource };
              resources.push(resource);
            }

            resource.amount -= r.value * x.count;
          });

          if (module.production != null) {
            let resource = resources.find(y => y.resource.id === module.production.resource.id);

            if (resource == null) {
              resource = { amount: 0, resource: module.production.resource };
              resources.push(resource);
            }

            resource.amount += module.production.value * x.count;
          }
        }
      }
    });

    return resources;
  }

  addModule() {
    this.stationModules.push({ moduleId: 0, count: 0 });
  }
}
