import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { LoadLayoutComponent } from './components/load-layout.component';
import { SaveLayoutComponent } from './components/save-layout.component';
import { ShareLayoutComponent } from './components/share-layout.component';
import { StationCalculatorComponent } from './components/station-calculator.component';
import { StationModulesComponent } from './components/station-modules.component';
import { StationResourcesComponent } from './components/station-resources/station-resources.component';
import { StationSummaryComponent } from './components/station-summary/station-summary.component';
import { LayoutService } from './services/layout-service';
import { StationRoutingModule } from './station-routing.module';
import { ImportPlansComponent } from './components/import-plans.component';
import { ImportPlanResultComponent } from './components/import-plan-result.component';

@NgModule({
   imports: [
      NgbModalModule,
      CommonModule,
      FormsModule,
      SharedModule,
      StationRoutingModule,
      DragDropModule
   ],
   declarations: [
      LoadLayoutComponent,
      SaveLayoutComponent,
      ShareLayoutComponent,
      StationCalculatorComponent,
      StationResourcesComponent,
      StationModulesComponent,
      StationSummaryComponent,
      ImportPlansComponent,
      ImportPlanResultComponent
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
