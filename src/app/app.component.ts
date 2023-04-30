import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AnalyticsService } from './google-analytics/services/analytics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  theme = 'dark';

  constructor(router: Router, analytics: AnalyticsService) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        analytics.pageView({ path: event.urlAfterRedirects });
      }
    });
  }
}
