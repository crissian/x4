import { OnInit, Directive } from '@angular/core';
import { EntityService } from '../services/entity.service';
import { ComponentBase } from './component-base';
import { ActivatedRoute, Router } from '@angular/router';

@Directive()
export abstract class EntityListComponent<T> extends ComponentBase implements OnInit {
   currentFilter: string;
   entities: T[];

   protected constructor(protected service: EntityService<T>,
                         protected router: Router,
                         protected route: ActivatedRoute) {
      super();
   }

   ngOnInit(): void {
      this.entities = this.service.getEntities();
   }

   onRowSelect(e: any) {
      if (e.rowType == 'data') {
         const id = this.getId(e.row.data);
         return this.router.navigate([ id ], { relativeTo: this.route });
      }
   }

   getId(value: any) {
      return value.id;
   }
}
