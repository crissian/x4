import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideLucideConfig } from '@lucide/angular';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import { getLocale } from './core/language';
import { provideAnalytics } from './google-analytics/services/analytics.service';

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		{ provide: LOCALE_ID, useValue: getLocale() },
		provideRouter(appRoutes, withComponentInputBinding()),
		provideLucideConfig({ size: '1em' }),
		provideAnalytics({ trackingId: environment.googleAnalytics }),
	],
};
