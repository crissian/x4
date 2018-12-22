import { Component, OnInit } from '@angular/core';
import { ComponentBase } from '../../shared/components/component-base';
import { StationModule } from '../../shared/services/model/model';
import { WareService } from '../../shared/services/ware.service';
import { ModuleService } from '../../shared/services/module.service';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { takeUntil } from 'rxjs/operators';

@Component({
  templateUrl: './module-detail.component.html'
})
export class ModuleDetailComponent  extends ComponentBase implements OnInit {
  public entity: StationModule;

  constructor(private wareService: WareService, private moduleService: ModuleService,
              private route: ActivatedRoute, private titleService: Title) {
    super();
  }

  ngOnInit(): void {
    this.titleService.setTitle('X4:Foundations - Modules');

    this.route.paramMap
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        const id = data.get('id');
        if (id) {
          this.entity = this.moduleService.getModule(id);
          if (this.entity == null) {
            return;
          }

          this.titleService.setTitle(`X4:Foundations - Modules - ${this.entity.name}`);
        }
      });
  }
}
