import { Injectable } from '@angular/core';
import { StorageService } from '../../core/services/storage.service';
import { Layout } from '../../shared/services/module-config';
import { LayoutV0Service } from './layout-v0.service';
import { LayoutV1Service } from './layout-v1.service';

@Injectable()
export class LayoutService {
  private static version = 1;
  private static storageKey = 'layouts';

  private static services = [
    new LayoutV0Service(),
    new LayoutV1Service()
  ];

  private static getCurrentService() {
    return this.services[LayoutService.version];
  }

  constructor(private storageService: StorageService) {
  }

  getLayouts(): Layout[] {
    const data = this.storageService.get<any>(LayoutService.storageKey);
    const layoutVersion = data.version || 0;

    const layouts = LayoutService.services[layoutVersion].getLayouts(data);
    return layouts || [];
  }

  getLayout(name: string): Layout {
    return this.getLayouts()
      .find(x => x.name === name);
  }

  saveLayout(layout: Layout) {
    const layouts = this.getLayouts();

    const index = layouts.findIndex(x => x.name.toLowerCase() === layout.name.toLowerCase());

    if (index >= 0) {
      layouts[index] = layout;
    } else {
      layouts.push(layout);
    }

    this.saveLayoutsInternal(layouts);
  }

  deleteLayout(name: string) {
    const layouts = this.getLayouts();

    const index = layouts.findIndex(x => x.name.toLowerCase() === name.toLowerCase());
    if (index >= 0) {
      layouts.splice(index, 1);
    }

    this.saveLayoutsInternal(layouts);
  }

  saveLayoutsInternal(layouts: Layout[]) {
    const data = LayoutService.getCurrentService().getSaveData(layouts);
    this.storageService.add(LayoutService.storageKey, { ...data, version: LayoutService.version });
  }
}
