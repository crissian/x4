import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withHashLocation } from '@angular/router';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import { provideAnalytics } from './google-analytics/services/analytics.service';

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideRouter(appRoutes, withHashLocation(), withComponentInputBinding()),
		provideAnalytics({ trackingId: environment.googleAnalytics }),
	],
};
