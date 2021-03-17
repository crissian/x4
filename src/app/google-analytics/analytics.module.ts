import { ModuleWithProviders, NgModule } from '@angular/core';
import { AnalyticsService } from './services/analytics.service';
import { AnalyticsConfig } from './services/analytics.config';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    AnalyticsService,
  ]
})
export class AnalyticsModule {
  static forRoot(config: AnalyticsConfig): ModuleWithProviders<AnalyticsModule> {
    return {
      ngModule: AnalyticsModule,
      providers: [
        AnalyticsService,
        { provide: 'analyticsConfig', useValue: config }
      ]
    };
  }
}
