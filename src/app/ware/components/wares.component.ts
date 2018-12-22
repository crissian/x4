import { Component, OnInit } from '@angular/core';
import { WareService } from '../../shared/services/ware.service';
import { ComponentBase } from '../../shared/components/component-base';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Ware } from '../../shared/services/model/model';

@Component({
  templateUrl: './wares.component.html'
})
export class WaresComponent extends ComponentBase implements OnInit {
  entities: Ware[];
  filterText: string;

  columns = [
    { prop: 'name', name: 'Name' },
    { prop: 'transport', name: 'Transport' },
    { prop: 'price.min', name: 'Min Price' },
    { prop: 'price.avg', name: 'Avg Price' },
    { prop: 'price.max', name: 'Max Price' },
    { prop: 'volume', name: 'Volume' }
  ];

  constructor(private wareService: WareService, private router: Router, private titleService: Title) {
    super();
  }

  ngOnInit(): void {
    this.titleService.setTitle('X4:Foundations - Wares');
    this.entities = this.wareService
      .getWares();
  }

  onSelect(event: any) {
    if (event.selected && event.selected.length) {
      const item: Ware = event.selected[0];
      return this.router.navigate([ '/wares', item.id ]);
    }
  }

  onFilterChanged() {
    this.entities = this.wareService
      .getWares();

    if (this.filterText != null) {
      this.entities = this.entities.filter(x => x.name.toLowerCase().indexOf(this.filterText) > -1);
    }
  }

  rowClass() {
    return { hover: true };
  }

  priceDifPerVolumeComparator(valueA, valueB, rowA, rowB) {
    const propA = (rowA.price.max - rowA.price.min) / rowA.volume;
    const propB = (rowB.price.max - rowB.price.min) / rowB.volume;
    return propA - propB;
  }

}
