import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Faction } from '../../shared/services/model/model';
import { EntityListComponent } from '../../shared/components/entity-list.component';
import { FactionService } from '../../shared/services/faction.service';

@Component({
   templateUrl: './factions.component.html'
})
export class FactionsComponent extends EntityListComponent<Faction> implements OnInit {
   constructor(factionService: FactionService,
               private router: Router,
               private titleService: Title,
               private route: ActivatedRoute) {
      super(factionService);
   }

   ngOnInit(): void {
      this.titleService.setTitle('X4: Foundations - Factions');
      super.ngOnInit();
   }

   rowClass() {
      return { hover: true };
   }

   onRowSelect(e: any) {
      if (e.rowType == 'data') {
         return this.router.navigate([ e.row.data.id ], { relativeTo: this.route });
      }
   }
}
