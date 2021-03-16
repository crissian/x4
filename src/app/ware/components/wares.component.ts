import { Component, OnInit } from '@angular/core';
import { WareService } from '../../shared/services/ware.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Ware } from '../../shared/services/model/model';
import { EntityListComponent } from '../../shared/components/entity-list.component';
import { TransportType } from '../../shared/services/data/transport-data';
import { EnumFn } from '../../core/services/enum-fn';
import {BASE_TITLE} from '../../shared/services/constants';

@Component({
   templateUrl: './wares.component.html'
})
export class WaresComponent extends EntityListComponent<Ware> implements OnInit {
   transportTypes: string[];

   constructor(wareService: WareService,
               router: Router,
               route: ActivatedRoute,
               private titleService: Title) {
      super(wareService, router, route);
   }

   ngOnInit(): void {
      this.titleService.setTitle(`${BASE_TITLE} - Wares`);

      this.transportTypes = EnumFn.values(TransportType);
      super.ngOnInit();
   }

   calculatePriceDiffPerVolume(ware: Ware) {
      return (ware.price.max - ware.price.min) / ware.volume;
   }
}
