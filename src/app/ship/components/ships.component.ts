import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Ship } from '../../shared/services/model/model';
import { EntityListComponent } from '../../shared/components/entity-list.component';
import { ShipService } from '../../shared/services/ship.service';

@Component({
  templateUrl: './ships.component.html'
})
export class ShipsComponent extends EntityListComponent<Ship> implements OnInit {
  constructor(entityService: ShipService, private router: Router, private titleService: Title) {
    super(entityService);
  }

  ngOnInit(): void {
    this.titleService.setTitle('X4: Foundations - Ships');
    super.ngOnInit();
  }

  filter(x: Ship, text: string): boolean {
    return x.name.toLowerCase().indexOf(text) > -1 ||
      (x.race != null && x.race.name.toLowerCase().indexOf(text) > -1) ||
      (x.owners != null && x.owners.find(y => y.name.toLowerCase().indexOf(text) > -1) != null) ||
      (x.thruster != null && x.thruster.toLowerCase().indexOf(text) > -1) ||
      (x.type != null && x.type.toLowerCase().indexOf(text) > -1) ||
      (x.purpose != null && x.purpose.toLowerCase().indexOf(text) > -1);
  }

  onSelectCore(item: Ship) {
    return this.router.navigate([ '/ships', item.id ]);
  }
}
