import {Directive, OnDestroy} from '@angular/core';
import { Subject } from 'rxjs';

@Directive()
// tslint:disable-next-line:directive-class-suffix
export class ComponentBase implements OnDestroy {
  onDestroy: Subject<void> = new Subject();

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
