import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { LoadLayoutComponent } from './components/load-layout.component';
import { SaveLayoutComponent } from './components/save-layout.component';
import { ShareLayoutComponent } from './components/share-layout.component';
import { StationCalculatorComponent } from './components/station-calculator.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { LayoutService } from './services/layout-service';
import { StationResourcesComponent } from './components/station-resources.component';
import { StationModulesComponent } from './components/station-modules.component';
import { StationSummaryComponent } from './components/station-summary.component';

@NgModule({
  declarations: [
    LoadLayoutComponent,
    SaveLayoutComponent,
    ShareLayoutComponent,
    StationCalculatorComponent,
    StationResourcesComponent,
    StationModulesComponent,
    StationSummaryComponent
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
    LayoutService
  ]
})
export class StationModule {
}
