import { NgModule } from '@angular/core';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { LoadLayoutComponent } from './components/load-layout.component';
import { SaveLayoutComponent } from './components/save-layout.component';
import { ShareLayoutComponent } from './components/share-layout.component';
import { StationCalculatorComponent } from './components/station-calculator.component';
import { SharedModule } from '../shared/shared.module';
import { LayoutService } from './services/layout-service';
import { StationResourcesComponent } from './components/station-resources.component';
import { StationModulesComponent } from './components/station-modules.component';
import { StationSummaryComponent } from './components/station-summary.component';
import { CommonModule } from '@angular/common';
import { StationRoutingModule } from './station-routing.module';

@NgModule({
  imports: [
    NgbModalModule,
    CommonModule,
    FormsModule,
    SharedModule,
    StationRoutingModule
  ],
  declarations: [
    LoadLayoutComponent,
    SaveLayoutComponent,
    ShareLayoutComponent,
    StationCalculatorComponent,
    StationResourcesComponent,
    StationModulesComponent,
    StationSummaryComponent
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
