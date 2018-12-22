import { Component, OnInit } from '@angular/core';
import { StationModule } from '../../shared/services/model/model';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ComponentBase } from '../../shared/components/component-base';
import { ModuleService } from '../../shared/services/module.service';

@Component({
  templateUrl: './modules.component.html'
})
export class ModulesComponent extends ComponentBase implements OnInit {
  entities: StationModule[];
  filterText: string;

  columns = [
    { prop: 'name', name: 'Name' },
    { prop: 'type.name', name: 'Type' },
    { prop: 'makerRace.name', name: 'Race' },
    { prop: 'product.name', name: 'Product' },
  ];

  constructor(private moduleService: ModuleService, private router: Router, private titleService: Title) {
    super();
  }

  ngOnInit(): void {
    this.titleService.setTitle('X4:Foundations - Modules');
    this.entities = this.moduleService
      .allModules;
  }

  onSelect(event: any) {
    if (event.selected && event.selected.length) {
      const item: StationModule = event.selected[0];
      return this.router.navigate([ '/modules', item.id ]);
    }
  }

  onFilterChanged() {
    this.entities = this.moduleService
      .allModules;

    if (this.filterText != null) {
      const text = this.filterText.trim();

      this.entities = this.entities
        .filter(x =>
          x.name.toLowerCase().indexOf(text) > -1 ||
          x.type.name.toLowerCase().indexOf(text) > -1 ||
          (x.makerRace != null && x.makerRace.name.toLowerCase().indexOf(text) > -1) ||
          (x.product != null && x.product.name.toLowerCase().indexOf(text) > -1)
        );
    }
  }

  rowClass() {
    return { hover: true };
  }
}
