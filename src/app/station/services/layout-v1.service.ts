import { inject } from '@angular/core';
import { Layout } from '../../shared/services/module-config';
import { LayoutVersionService } from './layout-version.service';
import { StationModule } from '../../shared/services/model/model';
import { ModuleService } from '../../shared/services/module.service';

export interface ModuleConfigV1 {
  moduleId?: string;
  productionId: string;
  count: number;
}

export interface LayoutV1 {
  name: string;
  config: ModuleConfigV1[];
}

export class LayoutV1Service implements LayoutVersionService {
  private readonly moduleService = inject(ModuleService);

  private findModule(wareId: string, productionId: string): StationModule | undefined {
    return this.moduleService.getModuleByWare(wareId, productionId);
  }

  getLayouts(data: unknown): Layout[] {
    const layouts = (data as { layouts?: LayoutV1[] }).layouts;
    if (!layouts) {
      return [];
    }
    return layouts.map(x => {
      return {
        name: x.name,
        config: x.config.flatMap(y => {
          const module = y.moduleId ? this.findModule(y.moduleId, y.productionId) : undefined;
          return module ? [{ count: y.count, moduleId: module.id }] : [];
        })
      };
    });
  }

  getSaveData(layouts: Layout[]) {
    return {
      layouts: layouts
    };
  }
}
