import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FactionsComponent } from './components/factions.component';
import { FactionDetailComponent } from './components/faction-detail.component';
import { SharedModule } from '../shared/shared.module';
import { FactionRoutingModule } from './faction-routing.module';
import { CommonModule } from '@angular/common';
import { DxDataGridModule } from 'devextreme-angular';

@NgModule({
   imports: [
      CommonModule,
      FormsModule,
      SharedModule,
      DxDataGridModule,
      FactionRoutingModule
   ],
   declarations: [
      FactionsComponent,
      FactionDetailComponent
   ]
})
export class FactionModule {
}
