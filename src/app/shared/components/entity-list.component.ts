import { OnInit } from '@angular/core';
import { EntityService } from '../services/entity.service';
import { ComponentBase } from './component-base';

export abstract class EntityListComponent<T> extends ComponentBase implements OnInit {
   currentFilter: string;
   entities: T[];

   protected constructor(protected service: EntityService<T>) {
      super();
   }

   ngOnInit(): void {
      this.entities = this.service.getEntities();
   }
}
