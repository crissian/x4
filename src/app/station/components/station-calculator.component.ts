import { Dialog } from '@angular/cdk/dialog';
import { Component, computed, effect, inject, input, linkedSignal, signal } from '@angular/core';
import { FormField, applyEach, disabled, form, max, min } from '@angular/forms/signals';
import { LucideFilePlus, LucideSave, LucideSaveAll, LucideFolderOpen, LucideShare2, LucideImport } from '@lucide/angular';
import * as urlon from 'urlon';
import { MessagesComponent } from '../../shared/components/messages.component';
import { openDialog } from '../../shared/components/modal/dialog';
import { Message, MessageType } from '../../shared/services/message';
import { Layout, ModuleConfig } from '../../shared/services/module-config';
import { ModuleService } from '../../shared/services/module.service';
import { WareService } from '../../shared/services/ware.service';
import { LayoutService } from '../services/layout-service';
import { ImportPlanResultComponent } from './import-plan-result.component';
import { ImportPlansComponent, ImportResult } from './import-plans.component';
import { LoadLayoutComponent, LoadLayoutResult, LoadLayoutType } from './load-layout.component';
import { SaveLayoutComponent } from './save-layout.component';
import { ShareLayoutComponent } from './share-layout.component';
import {
	DEFAULT_STATION_SETTINGS,
	ModuleRow,
	ResourceCalculator,
	StationModuleModel,
	StationSettings,
} from './station-calculator.model';
import { StationModulesComponent } from './station-modules.component';
import { StationResourcesComponent } from './station-resources/station-resources.component';
import { StationSummaryComponent } from './station-summary/station-summary.component';

const EMPTY_ROW: ModuleRow = { moduleId: '', count: 1 };

/** Reads the rows of a shared layout link (`?l=...`, urlon with `=` and `&` swapped for URL-safe characters). */
export function parseSharedLayout(value: string | undefined): ModuleRow[] | undefined {
	if (!value) {
		return undefined;
	}
	try {
		const layoutData = urlon.parse(value.replace(/-/g, '=').replace(/,/g, '&')) as { module: string; count: number }[];
		return layoutData.map((x) => ({ moduleId: x.module, count: x.count }));
	} catch (err) {
		console.log(err);
		return undefined;
	}
}

@Component({
	selector: 'app-station-calculator',
	imports: [
		LucideFilePlus,
		LucideSave,
		LucideSaveAll,
		LucideFolderOpen,
		LucideShare2,
		LucideImport,
		FormField,
		MessagesComponent,
		ImportPlanResultComponent,
		StationModulesComponent,
		StationResourcesComponent,
		StationSummaryComponent,
	],
	templateUrl: './station-calculator.component.html',
})
export default class StationCalculatorComponent {
	private readonly dialog = inject(Dialog);
	private readonly layoutService = inject(LayoutService);
	private readonly wareService = inject(WareService);
	private readonly moduleService = inject(ModuleService);

	/** Shared layout from the `l` query parameter. */
	readonly l = input<string>();

	readonly layout = signal<Layout | null>(null);
	readonly messages = signal<Message[]>([]);
	readonly importResult = signal<ImportResult | null>(null);

	/** Station layout rows */
	readonly rows = linkedSignal<ModuleRow[]>(() => parseSharedLayout(this.l()) ?? [{ ...EMPTY_ROW }]);
	readonly rowsForm = form(this.rows, (row) => {
		applyEach(row, (item) => {
			min(item.count, 0);
		});
	});

	/** Station settings: sun light, workforce and prices */
	readonly settings = signal<StationSettings>({ ...DEFAULT_STATION_SETTINGS });
	readonly settingsForm = form(this.settings, (settings) => {
		min(settings.sunlight, 0);
		min(settings.partialWorkforce, 0);
		min(settings.storageHours, 0);
		max(settings.partialWorkforce, () => this.workforce().capacity);
		for (const price of [settings.resourcesPrice, settings.productsPrice, settings.modulesResourcesPrice]) {
			min(price, 0);
			max(price, 100);
		}
		disabled(settings.partialWorkforce, ({ valueOf }) => valueOf(settings.autoWorkforce));
	});

	readonly modules = computed(() =>
		this.rows().map(
			(x) => new StationModuleModel(this.wareService, this.moduleService, x.moduleId, Number(x.count) || 0)
		)
	);

	readonly workforce = computed(() => ResourceCalculator.calculateWorkforce(this.modules(), this.settings().isHq));

	/** Workforce actually working: everything available when auto, otherwise the slider value, capped by capacity. */
	readonly partialWorkforce = computed(() => {
		const { value, capacity } = this.workforce();
		const settings = this.settings();
		return Math.min(settings.autoWorkforce ? value : settings.partialWorkforce, capacity);
	});

	readonly resources = computed(() => {
		const settings = this.settings();
		return ResourceCalculator.calculate(this.modules(), settings.sunlight, this.partialWorkforce(), settings.isHq);
	});

	constructor() {
		// keep the workforce slider in line with the calculated value
		effect(() => {
			const partialWorkforce = this.partialWorkforce();
			const field = this.settingsForm.partialWorkforce();
			if (field.value() !== partialWorkforce) {
				field.value.set(partialWorkforce);
			}
		});
	}

	shareLayout() {
		const data = this.rows()
			.filter((x) => x.count > 0 && x.moduleId)
			.map((x) => ({ module: x.moduleId, count: x.count }));
		const params = urlon.stringify(data).replace(/=/g, '-').replace(/&/g, ',');
		const url = window.location.href.split('?')[0];
		openDialog(this.dialog, ShareLayoutComponent, { data: `${url}?l=${params}` });
	}

	saveLayoutAs() {
		openDialog<string>(this.dialog, SaveLayoutComponent).closed.subscribe((name) => {
			if (name) {
				this.saveLayoutInternal(name);
			}
		});
	}

	saveLayout() {
		const name = this.layout()?.name;
		if (!name) {
			this.saveLayoutAs();
		} else {
			this.saveLayoutInternal(name);
		}
	}

	newLayout() {
		this.loadLayoutInternal({ name: '', config: [{ ...EMPTY_ROW }] });
	}

	loadLayout() {
		openDialog<LoadLayoutResult>(this.dialog, LoadLayoutComponent, { size: 'lg' }).closed.subscribe((data) => {
			if (!data) {
				return;
			}

			const layout = this.layoutService.getLayout(data.layoutName);
			if (!layout) {
				return;
			}

			if (data.type == LoadLayoutType.load) {
				this.loadLayoutInternal(layout);
			} else if (data.type == LoadLayoutType.add) {
				this.rows.update((rows) => {
					const result = rows.map((x) => ({ ...x }));
					for (const item of layout.config) {
						if (!item.moduleId) {
							continue;
						}
						const existing = result.find((x) => x.moduleId == item.moduleId);
						if (existing == null) {
							result.push({ moduleId: item.moduleId, count: item.count });
						} else {
							existing.count += item.count;
						}
					}
					return result;
				});
			}
		});
	}

	importPlans() {
		openDialog<ImportResult>(this.dialog, ImportPlansComponent).closed.subscribe((result) => {
			if (result) {
				this.importResult.set(result);
			}
		});
	}

	onSelectPlan(name: string) {
		const layout = this.layoutService.getLayout(name);
		if (layout) {
			this.loadLayoutInternal(layout);
		}
	}

	private saveLayoutInternal(name: string) {
		const settings = this.settings();
		const layout: Layout = {
			name,
			resourcesPrice: settings.resourcesPrice,
			productsPrice: settings.productsPrice,
			modulesResourcesPrice: settings.modulesResourcesPrice,
			provideBasicResources: settings.provideBasicResources,
			provideAllResources: settings.provideAllResources,
			isHeadquarters: settings.isHq,
			sunlight: settings.sunlight,
			storageHours: settings.storageHours,
			config: this.rows().map<ModuleConfig>((x) => ({ moduleId: x.moduleId, count: x.count })),
		};

		this.layoutService.saveLayout(layout);
		this.layout.set(layout);
		this.messages.update((messages) => [
			...messages,
			{ type: MessageType.success, content: `<strong>${name}</strong> successfully saved.` },
		]);
	}

	private loadLayoutInternal(layout: Layout) {
		this.layout.set(layout);
		this.rows.set(layout.config.map((x) => ({ moduleId: x.moduleId ?? '', count: x.count })));
		this.settings.update((settings) => ({
			...settings,
			productsPrice: layout.productsPrice ?? 50,
			modulesResourcesPrice: layout.modulesResourcesPrice ?? 50,
			resourcesPrice: layout.resourcesPrice ?? 50,
			provideBasicResources: !!layout.provideBasicResources,
			provideAllResources: !!layout.provideAllResources,
			isHq: !!layout.isHeadquarters,
			sunlight: layout.sunlight || 100,
			storageHours: layout.storageHours ?? DEFAULT_STATION_SETTINGS.storageHours,
		}));
	}
}
