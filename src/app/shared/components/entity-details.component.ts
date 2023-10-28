import { ComponentBase } from './component-base';
import { OnInit, Directive } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { EntityService } from '../services/entity.service';
import { ActivatedRoute } from '@angular/router';

@Directive()
export abstract class EntityDetailsComponent<T> extends ComponentBase implements OnInit {
  public entity: T;

  protected constructor(protected service: EntityService<T>, protected route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        const id = data.get('id');
        if (id) {
          this.entity = this.service.getEntity(id);
          if (this.entity == null) {
            return;
          } else {
            this.onEntityLoaded(this.entity);
          }
        }
      });
  }

  onEntityLoaded(value: T) {
  }
}
