import { OnInit } from '@angular/core';
import { EntityService } from '../services/entity.service';
import { ComponentBase } from './component-base';

export abstract class EntityListComponent<T> extends ComponentBase implements OnInit {
   filterText: string;
   entities: T[];

   protected constructor(protected service: EntityService<T>) {
      super();
   }

   ngOnInit(): void {
      this.entities = this.service.getEntities();
   }

   onSelect(event: any) {
      if (event.selected && event.selected.length) {
         const item: T = event.selected[0];
         this.onSelectCore(item);
      }
   }

   onFilterChanged() {
      this.entities = this.service.getEntities();

      const text = (this.filterText || '').trim().toLowerCase();

      this.entities = this.entities
         .filter(x => {
            return this.filter(x, text);
         });
   }

   rowClass() {
      return { hover: true };
   }

   abstract filter(entity: T, text: string): boolean;

   abstract onSelectCore(item: T);
}
