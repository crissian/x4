import { Component, OnInit } from '@angular/core';
import { EntityListComponent } from '../../shared/components/entity-list.component';
import { Equipment } from '../../shared/services/model/model';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
   templateUrl: './equipments.component.html'
})
export class EquipmentsComponent extends EntityListComponent<Equipment> implements OnInit {
   constructor(private router: Router, private titleService: Title) {
      super(null);
   }

   filter(x: Equipment, text: string): boolean {
      return x.name.toLowerCase().indexOf(text) > -1 ||
         (x.race != null && x.race.name.toLowerCase().indexOf(text) > -1) ||
         (x.owners != null && x.owners.find(y => y.name.toLowerCase().indexOf(text) > -1) != null) ||
         (x.type != null && x.type.toLowerCase().indexOf(text) > -1) ||
         (x.equipmentClass != null && x.equipmentClass.toLowerCase().indexOf(text) > -1);
   }

   onSelectCore(item: Equipment) {
      return this.router.navigate([ '/equipment', item.id ]);
   }

   ngOnInit(): void {
      this.titleService.setTitle('X4: Foundations - Equipment');
      super.ngOnInit();
   }
}
