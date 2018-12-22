import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { RacesComponent } from './components/races.component';
import { RaceDetailComponent } from './components/race-detail.component';

@NgModule({
  imports: [
    NgbModule,
    BrowserModule,
    FormsModule,
    SharedModule,
    RouterModule,
    NgxDatatableModule
  ],
  declarations: [
    RacesComponent,
    RaceDetailComponent
  ]
})
export class RaceModule {
}
