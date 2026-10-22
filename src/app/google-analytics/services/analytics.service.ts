import { EnvironmentProviders, Injectable, InjectionToken, inject, makeEnvironmentProviders } from '@angular/core';
import { AnalyticsConfig } from './analytics.config';

declare const gtag: (...args: unknown[]) => void;

export interface PageInfo {
	title?: string;
	location?: string;
	path: string;
}

export interface EventInfo {
	action: string;
	category?: string;
	label?: string;
}

export const ANALYTICS_CONFIG = new InjectionToken<AnalyticsConfig>('analyticsConfig', {
	factory: () => ({ trackingId: '' }),
});

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
	static provide(config: AnalyticsConfig): EnvironmentProviders {
		return makeEnvironmentProviders([{ provide: ANALYTICS_CONFIG, useValue: config }]);
	}

	private readonly config = inject(ANALYTICS_CONFIG);

	pageView(page: PageInfo) {
		if (!this.config.trackingId) {
			return;
		}

		if (!page.path.startsWith('/')) {
			page.path = `/${page.path}`;
		}
		const args: Record<string, string> = {
			page_path: page.path,
		};

		if (page.location) {
			args['page_location'] = page.path;
		}
		if (page.title) {
			args['page_title'] = page.title;
		}
		gtag('config', this.config.trackingId, args);
	}

	event(evt: EventInfo) {
		if (!this.config.trackingId) {
			return;
		}
		gtag('event', evt.action, { event_category: evt.category, event_label: evt.label });
	}
}
