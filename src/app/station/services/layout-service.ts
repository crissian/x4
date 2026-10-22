import { Injectable, inject } from '@angular/core';
import { StorageService } from '../../core/services/storage.service';
import { Layout } from '../../shared/services/module-config';
import { LayoutV0Service } from './layout-v0.service';
import { LayoutV1Service } from './layout-v1.service';
import { LayoutV2Service } from './layout-v2.service';
import { LayoutVersionService } from './layout-version.service';
import { AnalyticsService } from '../../google-analytics/services/analytics.service';

@Injectable({ providedIn: 'root' })
export class LayoutService {
	private static version = 2;
	private static storageKey = 'layouts';

	private readonly services: LayoutVersionService[];

	private getCurrentService() {
		return this.services[LayoutService.version];
	}

	private readonly storageService = inject(StorageService);
	private readonly analytics = inject(AnalyticsService);

	constructor() {
		this.services = [new LayoutV0Service(), new LayoutV1Service(), new LayoutV2Service()];
	}

	getLayouts(): Layout[] {
		const data = this.storageService.get<{ version?: number }>(LayoutService.storageKey) || { version: LayoutService.version };

		const layoutVersion = data.version || 0;

		const layouts = this.services[layoutVersion].getLayouts(data);
		return layouts || [];
	}

	getLayout(name: string): Layout | undefined {
		this.analytics.event({ label: name, category: 'Layouts', action: 'Load Layout' });
		return this.getLayouts().find((x) => x.name === name);
	}

	saveLayout(layout: Layout) {
		const layouts = this.getLayouts();

		const index = layouts.findIndex((x) => x.name.toLowerCase() === layout.name.toLowerCase());

		if (index >= 0) {
			layouts[index] = layout;
		} else {
			layouts.push(layout);
		}

		this.analytics.event({ label: layout.name, category: 'Layouts', action: 'Save Layout' });
		this.saveLayoutsInternal(layouts);
	}

	deleteLayout(name: string) {
		this.analytics.event({ label: name, category: 'Layouts', action: 'Delete Layout' });
		const layouts = this.getLayouts();

		const index = layouts.findIndex((x) => x.name.toLowerCase() === name.toLowerCase());
		if (index >= 0) {
			layouts.splice(index, 1);
		}

		this.saveLayoutsInternal(layouts);
	}

	/** All saved layouts as JSON, in the same format they are kept in local storage. */
	exportLayouts(): string {
		const data = this.getCurrentService().getSaveData(this.getLayouts());
		return JSON.stringify({ ...data, version: LayoutService.version }, null, 2);
	}

	/**
	 * Adds the layouts of an exported JSON file to the saved ones, replacing layouts with the same name.
	 * @returns the number of imported layouts
	 */
	importLayouts(json: string): number {
		const data = JSON.parse(json) as { version?: number };
		const service = this.services[data?.version ?? 0];
		const imported = service?.getLayouts(data);
		if (!Array.isArray(imported) || imported.some((x) => typeof x?.name !== 'string' || !Array.isArray(x.config))) {
			throw new Error('Not a layouts file');
		}

		const layouts = this.getLayouts();
		for (const layout of imported) {
			const index = layouts.findIndex((x) => x.name.toLowerCase() === layout.name.toLowerCase());
			if (index >= 0) {
				layouts[index] = layout;
			} else {
				layouts.push(layout);
			}
		}

		this.analytics.event({ label: String(imported.length), category: 'Layouts', action: 'Import Layouts' });
		this.saveLayoutsInternal(layouts);
		return imported.length;
	}

	saveLayoutsInternal(layouts: Layout[]) {
		const data = this.getCurrentService().getSaveData(layouts);
		this.storageService.add(LayoutService.storageKey, { ...data, version: LayoutService.version });
	}
}
