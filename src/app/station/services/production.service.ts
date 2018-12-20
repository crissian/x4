import { WareService } from '../../shared/services/ware.service';
import { ModuleService } from '../../shared/services/module.service';
import { StationModule, Ware } from '../../shared/services/model/model';
import { Injectable } from '@angular/core';

@Injectable()
export class ProductionService {
  constructor(private wareService: WareService, private moduleService: ModuleService) {
  }

  getWare(wareId: string): Ware {
    return this.wareService.getWare(wareId);
  }

  getModuleByWare(wareId: string, productionId: string): StationModule {
    return this.moduleService.getModuleByWare(wareId, productionId);
  }
}
