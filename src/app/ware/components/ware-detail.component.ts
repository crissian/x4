import { Descriptions } from '../../shared/services/descriptions';
import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { EnumLabelPipe } from '../../core/enum-labels';
import { DetailComponent, DetailPageComponent } from '../../shared/components/detail-page.component';
import { RouterLink } from '@angular/router';
import { ProductionRequirementsComponent } from '../../shared/components/production-requirements.component';
import { TabItem, TabsComponent } from '../../shared/components/tabs/tabs.component';
import { ModuleService } from '../../shared/services/module.service';
import { ProducibleDetailPage } from '../../shared/components/entity-detail-page';
import { PriceRangePipe } from '../../core/format/price-range.pipe';
import { Ware } from '../../shared/services/model/model';
import { GameText } from '../../core/game-text';
import { LazyValue } from '../../core/lazy-value';
import { WareService } from '../../shared/services/ware.service';
import { ActiveSave } from '../../savegame/active-save';
import { StationCalculatorModel } from '../../station/components/station-calculator.model';
import { SaveWareTradeComponent } from './save-ware-trade.component';
import { Duration } from '../../core/format/duration';
import { FactionLabelComponent } from '../../shared/components/faction-label.component';

type WareTab = 'construction' | 'producedBy' | 'requiredFor' | 'save';

@Component({
	imports: [FactionLabelComponent, 
		DetailPageComponent,
		DetailComponent,
		DecimalPipe,
		RouterLink,
		ProductionRequirementsComponent,
		EnumLabelPipe,
		SaveWareTradeComponent,
		TabsComponent,
		PriceRangePipe,
	],
	templateUrl: './ware-detail.component.html',
})
export class WareDetailComponent extends ProducibleDetailPage<Ware> {
	protected readonly service = inject(WareService);
	protected readonly description = Descriptions.of('wares', this.id);
	private readonly moduleService = inject(ModuleService);

	private readonly activeSave = inject(ActiveSave);
	/** The active save has map data, so its stations can be listed. */
	private readonly hasSave = computed(() => !!this.activeSave.map());

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

	protected readonly waresUsedIn = computed(() => this.wareService.getWaresUsingWare(this.id()));
	protected readonly producedBy = computed(() =>
		this.moduleService
			.getEntities()
			.filter((x) =>
				[...(x.product ?? []), ...(x.processing ?? []).map((y) => y.ware)].some((y) => y.id === this.id())
			)
	);
	protected readonly modulesUsedIn = computed(() => this.moduleService.getModulesUsingWare(this.id()));
	/** Ships built from the ware; the ships are loaded with the tab, undefined until then. */
	private readonly ships = LazyValue.service(
		() => this.activeTab() === 'requiredFor',
		() =>
			GameText.withTexts(['ships'], () => import('../../shared/services/ship.service')).then((x) => x.ShipService)
	);
	protected readonly shipsUsedIn = computed(() => this.ships.value()?.getEntitiesUsingWare(this.id()));

	protected readonly formatTime = Duration.long;
	protected readonly amountPerCycle = StationCalculatorModel.amountPerCycle;
}
