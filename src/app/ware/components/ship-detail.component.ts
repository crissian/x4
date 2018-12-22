import { Component, OnInit } from '@angular/core';
import { WareService } from '../../shared/services/ware.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { ComponentBase } from '../../shared/components/component-base';
import { Title } from '@angular/platform-browser';

@Component({
  templateUrl: './ship-detail.component.html'
})
export class ShipDetailComponent extends ComponentBase implements OnInit {
  public entity: any;

  constructor(private wareService: WareService, private route: ActivatedRoute, private titleService: Title) {
    super();
  }

  ngOnInit(): void {
    this.titleService.setTitle('X4:Foundations - Ships');

    this.route.paramMap
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        const id = data.get('id');
        if (id) {
        }
      });
  }

  getTotalMin(production: any) {
    let total = 0;
    production.wares.forEach(x => {
      total += x.amount * x.ware.price.min;
    });
    return total;
  }

  getTotalMax(production: any) {
    let total = 0;
    production.wares.forEach(x => {
      total += x.amount * x.ware.price.max;
    });
    return total;
  }

  getTotalAvg(production: any) {
    let total = 0;
    production.wares.forEach(x => {
      total += x.amount * x.ware.price.average;
    });
    return total;
  }

  getProductionTime(amount: number) {
    const minutes = Math.trunc(amount / 60);
    const seconds = amount - minutes * 60;

    let result = '';
    if (minutes > 0) {
      result += ' ' + minutes + (minutes === 1 ? ' minute' : ' minutes');
    }
    if (seconds > 0) {
      if (minutes > 1) {
        result += ' ';
      }
      result += seconds + (seconds === 1 ? ' second' : ' seconds');
    }

    return result;
  }
}
