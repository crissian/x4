import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationCancel, NavigationEnd, NavigationError, Router, RouterOutlet } from '@angular/router';
import { SplashScreen } from './core/splash-screen';
import { AnalyticsService } from './google-analytics/services/analytics.service';
import { HeaderComponent } from './header.component';
import { RouteLoadingBarComponent } from './shared/components/route-loading-bar.component';

@Component({
	selector: 'app-root',
	imports: [HeaderComponent, RouteLoadingBarComponent, RouterOutlet],
	templateUrl: './app.component.html',
})
export class AppComponent {
	constructor() {
		const analytics = inject(AnalyticsService);
		inject(Router)
			.events.pipe(takeUntilDestroyed())
			.subscribe((event) => {
				if (event instanceof NavigationEnd) analytics.pageView({ path: event.urlAfterRedirects });
				if (
					event instanceof NavigationEnd ||
					event instanceof NavigationCancel ||
					event instanceof NavigationError
				)
					SplashScreen.hide();
			});
	}
}
