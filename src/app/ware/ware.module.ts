import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {WaresComponent} from './components/wares.component';
import {WareDetailComponent} from './components/ware-detail.component';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    NgbModule,
    BrowserModule,
    FormsModule,
    SharedModule,
    RouterModule
  ],
  declarations: [
    WaresComponent,
    WareDetailComponent
  ]
})
export class WareModule {
}
