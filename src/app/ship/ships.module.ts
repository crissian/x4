import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ShipsComponent } from './components/ships.component';
import { ShipDetailComponent } from './components/ship-detail.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    SharedModule,
    RouterModule
  ],
  declarations: [
    ShipsComponent,
    ShipDetailComponent
  ]
})
export class ShipsModule {
}
