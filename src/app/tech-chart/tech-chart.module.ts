import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { TechChartComponent } from './components/tech-chart.component';

@NgModule({
  imports: [
    NgbModule,
    BrowserModule,
    SharedModule,
    RouterModule
  ],
  declarations: [
    TechChartComponent
  ]
})
export class TechChartModule {
}
