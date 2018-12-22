import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { WareService } from '../../shared/services/ware.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Ware } from '../../shared/services/model/model';
import { DecimalPipe } from '@angular/common';
import { EntityListComponent } from '../../shared/components/entity-list.component';

@Component({
  templateUrl: './wares.component.html'
})
export class WaresComponent extends EntityListComponent<Ware> implements OnInit {
  public numberPipe: DecimalPipe;

  constructor(wareService: WareService, private router: Router, private titleService: Title, @Inject(LOCALE_ID) private locale: string) {
    super(wareService);

    this.numberPipe  = new DecimalPipe(locale);
  }

  ngOnInit(): void {
    this.titleService.setTitle('X4:Foundations - Wares');
    super.ngOnInit();
  }

  rowClass() {
    return { hover: true };
  }

  priceDifPerVolumeComparator(valueA, valueB, rowA, rowB) {
    const propA = (rowA.price.max - rowA.price.min) / rowA.volume;
    const propB = (rowB.price.max - rowB.price.min) / rowB.volume;
    return propA - propB;
  }

  filter(x: Ware, text: string): boolean {
    return x.name.toLowerCase().indexOf(this.filterText) > -1;
  }

  onSelectCore(item: Ware) {
    return this.router.navigate([ '/wares', item.id ]);
  }
}
