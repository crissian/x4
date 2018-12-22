import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { FactionsComponent } from './components/factions.component';
import { FactionDetailComponent } from './components/faction-detail.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

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
    FactionsComponent,
    FactionDetailComponent
  ]
})
export class FactionModule {
}
