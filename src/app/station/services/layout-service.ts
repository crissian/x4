import { Injectable } from '@angular/core';
import { StorageService } from '../../core/services/storage.service';
import { Layout } from '../../shared/services/module-config';

@Injectable()
export class LayoutService {
  private static storageKey = 'layouts';

  constructor(private storageService: StorageService) {
  }

  getLayouts() {
    const layouts = this.storageService.get<Layout[]>(LayoutService.storageKey);
    if (layouts == null) {
      return [];
    }
    return layouts;
  }

  saveLayout(layout: Layout) {
    const layouts = this.getLayouts();

    const index = layouts.findIndex(x => x.name.toLowerCase() === layout.name.toLowerCase());

    if (index >= 0) {
      layouts[index] = layout;
    } else {
      layouts.push(layout);
    }

    this.storageService.add(LayoutService.storageKey, layouts);
  }

  deleteLauout(layout: Layout) {
    const layouts = this.getLayouts();

    const index = layouts.findIndex(x => x.name.toLowerCase() === layout.name.toLowerCase());
    if (index >= 0) {
      layouts.splice(index, 1);
    }

    this.storageService.add(LayoutService.storageKey, layouts);
  }
}
