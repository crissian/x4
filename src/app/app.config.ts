import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideLucideConfig } from '@lucide/angular';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import { Language } from './core/language';
import { AnalyticsService } from './google-analytics/services/analytics.service';

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		{ provide: LOCALE_ID, useValue: Language.locale() },
		provideRouter(appRoutes, withComponentInputBinding()),
		provideLucideConfig({ size: '1em' }),
		AnalyticsService.provide({ trackingId: environment.googleAnalytics }),
	],
};
