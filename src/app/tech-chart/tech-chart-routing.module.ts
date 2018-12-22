import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import { TechChartModule } from './tech-chart.module';
import { TechChartComponent } from './components/tech-chart.component';

@NgModule({
  imports: [
    TechChartModule,
    RouterModule.forChild([
      {
        path: 'tech-chart',
        component: TechChartComponent
      }
    ])
  ]
})
export class TechChartRoutingModule {
}
