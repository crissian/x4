import {Directive, OnDestroy} from '@angular/core';
import { Subject } from 'rxjs';

@Directive()
export class ComponentBase implements OnDestroy {
  onDestroy: Subject<void> = new Subject();

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
