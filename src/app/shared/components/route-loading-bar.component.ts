import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

/** A thin bar at the top of the page while the router loads the next page. Shown only for slow loads (CSS delay). */
@Component({
	selector: 'app-route-loading-bar',
	templateUrl: './route-loading-bar.component.html',
	styleUrl: './route-loading-bar.component.css',
})
export class RouteLoadingBarComponent {
	protected readonly loading = signal(false);

	constructor() {
		inject(Router)
			.events.pipe(takeUntilDestroyed())
			.subscribe((event) => {
				if (event instanceof NavigationStart) this.loading.set(true);
				else if (
					event instanceof NavigationEnd ||
					event instanceof NavigationCancel ||
					event instanceof NavigationError
				)
					this.loading.set(false);
			});
	}
}
