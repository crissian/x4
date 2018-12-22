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

  constructor(private wareService: WareService, private router: Router, private titleService: Title) {
    super();
  }

  ngOnInit(): void {
    this.titleService.setTitle('X4:Foundations - Wares');
    this.entities = this.wareService
      .getWares();
  }

  showEntity(item: any) {
    return this.router.navigate(['/wares', item.id]);
  }
}
