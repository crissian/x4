import {NgModule} from '@angular/core';
import {StorageService} from './services/storage.service';

@NgModule({
  providers: [
    StorageService
  ]
})
export class CoreModule {
}
