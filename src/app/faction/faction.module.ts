import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FactionsComponent } from './components/factions.component';
import { FactionDetailComponent } from './components/faction-detail.component';
import { SharedModule } from '../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FactionRoutingModule } from './faction-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    NgxDatatableModule,
    FactionRoutingModule
  ],
  declarations: [
    FactionsComponent,
    FactionDetailComponent
  ]
})
export class FactionModule {
}
