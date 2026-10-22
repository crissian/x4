import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { EnumLabelPipe } from '../../core/enum-labels';
import { DetailComponent, DetailPageComponent } from '../../shared/components/detail-page.component';
import { RouterLink } from '@angular/router';
import { ProductionRequirementsComponent } from '../../shared/components/production-requirements.component';
import { TabItem, TabsComponent } from '../../shared/components/tabs/tabs.component';
import { ModuleService } from '../../shared/services/module.service';
import { Production } from '../../shared/services/production';
import { ShipService } from '../../shared/services/ship.service';
import { WareService } from '../../shared/services/ware.service';
import { SavegameStore } from '../../savegame/savegame-store';
import { StationCalculatorModel } from '../../station/components/station-calculator.model';
import { SaveWareTradeComponent } from './save-ware-trade.component';

type WareTab = 'construction' | 'producedBy' | 'requiredFor' | 'save';

@Component({
	imports: [
		DetailPageComponent,
		DetailComponent,
		DecimalPipe,
		RouterLink,
		ProductionRequirementsComponent,
		EnumLabelPipe,
		SaveWareTradeComponent,
		TabsComponent,
	],
	templateUrl: './ware-detail.component.html',
})
export class WareDetailComponent {
	private readonly wareService = inject(WareService);
	private readonly moduleService = inject(ModuleService);
	private readonly shipService = inject(ShipService);

	readonly id = input.required<string>();

	private readonly save = inject(SavegameStore);
	/** The active save has map data, so its stations can be listed. */
	private readonly hasSave = computed(() => !!this.save.active()?.data?.['map']);

	protected readonly tabs = computed(() => {
		const tabs: TabItem<WareTab>[] = [
			{ id: 'construction', label: $localize`Construction` },
			{ id: 'producedBy', label: $localize`Produced By` },
			{ id: 'requiredFor', label: $localize`Required For` },
		];
		return this.hasSave() ? [...tabs, { id: 'save' as const, label: $localize`Stations in your save` }] : tabs;
	});
	protected readonly selectedTab = signal<WareTab>('construction');
	/** The selected tab; the save tab falls back to the first one when the save goes away. */
	protected readonly activeTab = computed(() =>
		this.selectedTab() === 'save' && !this.hasSave() ? 'construction' : this.selectedTab()
	);

	protected readonly entity = computed(() => this.wareService.getEntity(this.id()));
	protected readonly production = computed(() =>
		Production.toProductionData(this.entity()?.production, this.wareService)
	);
	protected readonly waresUsedIn = computed(() => this.wareService.getWaresUsingWare(this.id()));
	protected readonly producedBy = computed(() =>
		this.moduleService
			.getEntities()
			.filter((x) =>
				[...(x.product ?? []), ...(x.processing ?? []).map((y) => y.ware)].some((y) => y.id === this.id())
			)
	);
	protected readonly modulesUsedIn = computed(() => this.moduleService.getModulesUsingWare(this.id()));
	protected readonly shipsUsedIn = computed(() => this.shipService.getEntitiesUsingWare(this.id()));

	protected readonly formatTime = Production.formatProductionTime;
	protected readonly amountPerCycle = StationCalculatorModel.amountPerCycle;
}
