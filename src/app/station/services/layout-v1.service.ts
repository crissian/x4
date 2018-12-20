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
  constructor(private moduleService: ModuleService) {
  }

  private findModule(wareId: string, productionId: string): StationModule {
    return this.moduleService.getModuleByWare(wareId, productionId);
  }

  getLayouts(data: any): Layout[] {
    const layouts: LayoutV1[] = data.layouts;
    if (!layouts) {
      return [];
    }
    return layouts.map(x => {
      return {
        name: x.name,
        config: x.config
          .map(y => {
            const module = this.findModule(y.moduleId, y.productionId);
            return {
              count: y.count,
              moduleId: module ? module.id : null
            };
          })
          .filter(z => z.moduleId != null)
      };
    });
  }

  getSaveData(layouts: Layout[]) {
    return {
      layouts: layouts
    };
  }
}
