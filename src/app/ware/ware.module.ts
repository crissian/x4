import { NgModule } from '@angular/core';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { WaresComponent } from './components/wares.component';
import { WareDetailComponent } from './components/ware-detail.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonModule } from '@angular/common';
import { WareRoutingModule } from './ware-routing.module';

@NgModule({
  imports: [
    NgbTabsetModule,
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule,
    NgxDatatableModule,
    WareRoutingModule
  ],
  declarations: [
    WaresComponent,
    WareDetailComponent
  ]
})
export class WareModule {
}
