import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {LoadLayoutComponent} from './components/load-layout.component';
import {SaveLayoutComponent} from './components/save-layout.component';
import {ShareLayoutComponent} from './components/share-layout.component';
import {StationCalculatorComponent} from './components/station-calculator.component';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import {LayoutService} from './services/layout-service';
import { ProductionService } from './services/production.service';

@NgModule({
  declarations: [
    LoadLayoutComponent,
    SaveLayoutComponent,
    ShareLayoutComponent,
    StationCalculatorComponent
  ],
  imports: [
    NgbModule,
    BrowserModule,
    FormsModule,
    SharedModule,
    RouterModule
  ],
  entryComponents: [
    LoadLayoutComponent,
    SaveLayoutComponent,
    ShareLayoutComponent
  ],
  providers: [
    LayoutService,
    ProductionService
  ]
})
export class StationModule {
}
