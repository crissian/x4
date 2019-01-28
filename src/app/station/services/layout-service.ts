import { Injectable } from '@angular/core';
import { StorageService } from '../../core/services/storage.service';
import { Layout } from '../../shared/services/module-config';
import { LayoutV0Service } from './layout-v0.service';
import { LayoutV1Service } from './layout-v1.service';
import { LayoutV2Service } from './layout-v2.service';
import { ModuleService } from '../../shared/services/module.service';
import { LayoutVersionService } from './layout-version.service';
import { AnalyticsService } from '../../google-analytics/services/analytics.service';

@Injectable()
export class LayoutService {
   private static version = 2;
   private static storageKey = 'layouts';

   private readonly services: LayoutVersionService[];

   private getCurrentService() {
      return this.services[LayoutService.version];
   }

   constructor(private storageService: StorageService, private moduleService: ModuleService, private analytics: AnalyticsService) {
      this.services = [
         new LayoutV0Service(),
         new LayoutV1Service(moduleService),
         new LayoutV2Service()
      ];
   }

   getLayouts(): Layout[] {
      const data = this.storageService.get<any>(LayoutService.storageKey) || { version: LayoutService.version };

      const layoutVersion = data.version || 0;

      const layouts = this.services[layoutVersion].getLayouts(data);
      return layouts || [];
   }

   getLayout(name: string): Layout {
      this.analytics.event({ label: name, category: 'Layouts', action: 'Load Layout' });
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

      this.analytics.event({ label: layout.name, category: 'Layouts', action: 'Save Layout' });
      this.saveLayoutsInternal(layouts);
   }

   deleteLayout(name: string) {
      this.analytics.event({ label: name, category: 'Layouts', action: 'Delete Layout' });
      const layouts = this.getLayouts();

      const index = layouts.findIndex(x => x.name.toLowerCase() === name.toLowerCase());
      if (index >= 0) {
         layouts.splice(index, 1);
      }

      this.saveLayoutsInternal(layouts);
   }

   saveLayoutsInternal(layouts: Layout[]) {
      const data = this.getCurrentService().getSaveData(layouts);
      this.storageService.add(LayoutService.storageKey, { ...data, version: LayoutService.version });
   }
}
