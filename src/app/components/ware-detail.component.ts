import { Component, OnInit } from '@angular/core';
import { ComponentBase } from '../shared/component-base';
import { WareService } from '../services/ware.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

@Component({
  templateUrl: './ware-detail.component.html'
})
export class WareDetailComponent extends ComponentBase implements OnInit {
  public entity: any;

  constructor(private wareService: WareService, private route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        const id = data.get('id');
        if (id) {
          this.wareService
            .getWare(id)
            .pipe(takeUntil(this.onDestroy))
            .subscribe(entity => {
              this.entity = entity;
            });
        }
      });
  }
}
