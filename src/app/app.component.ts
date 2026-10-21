import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AnalyticsService } from './google-analytics/services/analytics.service';
import { HeaderComponent } from './header.component';

@Component({
	selector: 'app-root',
	imports: [HeaderComponent, RouterOutlet],
	templateUrl: './app.component.html',
})
export class AppComponent {
	constructor() {
		const analytics = inject(AnalyticsService);
		inject(Router)
			.events.pipe(
				filter((event) => event instanceof NavigationEnd),
				takeUntilDestroyed()
			)
			.subscribe((event) => analytics.pageView({ path: event.urlAfterRedirects }));
	}
}
