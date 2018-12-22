import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Faction } from '../../shared/services/model/model';
import { EntityListComponent } from '../../shared/components/entity-list.component';
import { FactionService } from '../../shared/services/faction.service';

@Component({
  templateUrl: './factions.component.html'
})
export class FactionsComponent extends EntityListComponent<Faction> implements OnInit {
  constructor(factionService: FactionService, private router: Router, private titleService: Title) {
    super(factionService);
  }

  ngOnInit(): void {
    this.titleService.setTitle('X4:Foundations - Factions');
    super.ngOnInit();
  }

  rowClass() {
    return { hover: true };
  }

  filter(x: Faction, text: string): boolean {
    return x.name.toLowerCase().indexOf(this.filterText) > -1;
  }

  onSelectCore(item: Faction) {
    return this.router.navigate([ '/factions', item.id ]);
  }
}
