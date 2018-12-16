import { ComponentBase } from '../../shared/components/component-base';
import { Component, OnInit } from '@angular/core';
import { WareService } from '../../shared/services/ware.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { takeUntil } from 'rxjs/operators';

@Component({
  templateUrl: './equipments.component.html'
})
export class EquipmentsComponent extends ComponentBase implements OnInit {
  entities: any[];

  constructor(private wareService: WareService, private router: Router, private titleService: Title) {
    super();
  }

  ngOnInit(): void {
    this.titleService.setTitle('X4:Foundations - Equipment');
    this.wareService
      .getEquipment()
      .pipe(
        takeUntil(this.onDestroy)
      )
      .subscribe(data => {
        this.entities = data;
      });
  }

  showEntity(item: any) {
    return this.router.navigate(['/equipments', item.id]);
  }
}
