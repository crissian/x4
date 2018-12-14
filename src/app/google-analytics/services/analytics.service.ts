import { Inject, Injectable } from '@angular/core';
import { AnalyticsConfig } from './analytics.config';
declare var gtag: any;

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

@Injectable()
export class AnalyticsService {
  constructor(@Inject('analyticsConfig') private config: AnalyticsConfig) {
  }

  pageView(page: PageInfo) {
    if (!this.config.trackingId) {
      return;
    }

    if (!page.path.startsWith('/')) {
      page.path = `/${page.path}`;
    }
    const args = {
      page_path: page.path
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
