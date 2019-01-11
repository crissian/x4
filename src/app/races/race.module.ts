import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RacesComponent } from './components/races.component';
import { RaceDetailComponent } from './components/race-detail.component';
import { RaceRoutingModule } from './race-routing.module';
import { CommonModule } from '@angular/common';
import { DxDataGridModule } from 'devextreme-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RaceRoutingModule,
    DxDataGridModule
  ],
  declarations: [
    RacesComponent,
    RaceDetailComponent
  ]
})
export class RaceModule {
}
