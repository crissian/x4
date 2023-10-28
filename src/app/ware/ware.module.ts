import { NgModule } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { WaresComponent } from './components/wares.component';
import { WareDetailComponent } from './components/ware-detail.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WareRoutingModule } from './ware-routing.module';
import { DxDataGridModule } from 'devextreme-angular';

@NgModule({
   imports: [
      NgbNavModule,
      CommonModule,
      FormsModule,
      SharedModule,
      RouterModule,
      DxDataGridModule,
      WareRoutingModule
   ],
   declarations: [
      WaresComponent,
      WareDetailComponent
   ]
})
export class WareModule {
}
