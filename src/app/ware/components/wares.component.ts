import { Component, OnInit } from '@angular/core';
import { WareService } from '../../shared/services/ware.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Ware } from '../../shared/services/model/model';
import { EntityListComponent } from '../../shared/components/entity-list.component';
import { TransportType } from '../../shared/services/data/transport-data';

@Component({
   templateUrl: './wares.component.html'
})
export class WaresComponent extends EntityListComponent<Ware> implements OnInit {
   transportTypes: string[];

   constructor(wareService: WareService,
               private router: Router,
               private route: ActivatedRoute,
               private titleService: Title) {
      super(wareService);
   }

   ngOnInit(): void {
      this.titleService.setTitle('X4: Foundations - Wares');

      this.transportTypes = Object.keys(TransportType).map(x => TransportType[x]);
      super.ngOnInit();
   }

   onRowSelect(e: any) {
      if (e.rowType == 'data') {
         return this.router.navigate([ e.row.data.id ], { relativeTo: this.route });
      }
   }

   calculatePriceDiffPerVolume(ware: Ware) {
      return (ware.price.max - ware.price.min) / ware.volume;
   }
}
