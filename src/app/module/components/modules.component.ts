import { Component, OnInit } from '@angular/core';
import { StationModule } from '../../shared/services/model/model';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ModuleService } from '../../shared/services/module.service';
import { EntityListComponent } from '../../shared/components/entity-list.component';

@Component({
  templateUrl: './modules.component.html'
})
export class ModulesComponent extends EntityListComponent<StationModule> implements OnInit {
  columns = [
    { prop: 'name', name: 'Name' },
    { prop: 'type.name', name: 'Type' },
    { prop: 'makerRace.name', name: 'Race' },
    { prop: 'product.name', name: 'Product' },
  ];

  constructor(moduleService: ModuleService, private router: Router, private titleService: Title) {
    super(moduleService);
  }

  ngOnInit(): void {
    this.titleService.setTitle('X4:Foundations - Modules');
    super.ngOnInit();
  }

  filter(x: StationModule, text: string): boolean {
    return x.name.toLowerCase().indexOf(text) > -1 ||
      x.type.name.toLowerCase().indexOf(text) > -1 ||
      (x.makerRace != null && x.makerRace.name.toLowerCase().indexOf(text) > -1) ||
      (x.product != null && x.product.name.toLowerCase().indexOf(text) > -1);
  }

  onSelectCore(item: StationModule) {
    return this.router.navigate([ '/modules', item.id ]);
  }
}
