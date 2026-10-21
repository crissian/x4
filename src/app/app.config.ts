import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideLucideConfig } from '@lucide/angular';
import { provideRouter, withComponentInputBinding, withHashLocation } from '@angular/router';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import { provideAnalytics } from './google-analytics/services/analytics.service';

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideRouter(appRoutes, withHashLocation(), withComponentInputBinding()),
		provideLucideConfig({ size: '1em' }),
		provideAnalytics({ trackingId: environment.googleAnalytics }),
	],
};
