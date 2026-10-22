import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, input, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MacroId } from '../../core/macro-id';
import { StationTypeBadgeComponent } from '../../map/station-type-badge.component';
import { StationTrade } from '../../savegame/map/station-trade';
import { TabItem, TabsComponent } from '../../shared/components/tabs/tabs.component';
import { ModuleTypes } from '../../shared/services/data/module-types-data';
import { FactionService } from '../../shared/services/faction.service';
import { ModuleService } from '../../shared/services/module.service';
import { RaceService } from '../../shared/services/race.service';
import { WareService } from '../../shared/services/ware.service';
import { StationModuleGroups } from '../station-module-groups';
import type { SectorStationRow } from './sector-stations.component';

export interface StationOfferRow {
	ware: string;
	name: string;
	/** the ware exists in the site data */
	known: boolean;
	price: number;
	amount: number;
	playerOnly: boolean;
}

type DetailTab = 'sells' | 'buys' | 'modules';

/** The panel of the station selected on the sector page: its identity, then its offers, modules and workforce. */
@Component({
	selector: 'app-sector-station-details',
	imports: [DecimalPipe, RouterLink, StationTypeBadgeComponent, TabsComponent],
	templateUrl: './sector-station-details.component.html',
})
export class SectorStationDetailsComponent {
	readonly station = input.required<SectorStationRow>();

	private readonly wares = inject(WareService);
	private readonly races = inject(RaceService);
	private readonly factions = inject(FactionService);
	private readonly moduleService = inject(ModuleService);
	/** modules by save id: the macro lowercased without `_macro` */
	private readonly modulesBySaveId = new Map(this.moduleService.getEntities().map((x) => [MacroId.of(x.macro), x]));

	protected readonly owner = computed(() => {
		const owner = this.station().owner;
		return owner === 'player' ? undefined : this.factions.getEntity(owner);
	});
	protected readonly sells = computed(() => this.offers(true));
	protected readonly buys = computed(() => this.offers(false));
	protected readonly moduleGroups = computed(() => {
		const save = this.station().save;
		return StationModuleGroups.group(
			save
				? StationTrade.modules(save).map(({ id, count }) => {
						const module = this.modulesBySaveId.get(id.toLowerCase());
						const type = module?.type as ModuleTypes | undefined;
						return { id, count, name: module?.name ?? id, link: module?.id, type };
					})
				: []
		);
	});
	protected readonly tabs = computed<TabItem<DetailTab>[]>(() => [
		{ id: 'sells', label: $localize`Sells`, count: this.sells().length },
		{ id: 'buys', label: $localize`Buys`, count: this.buys().length },
		{
			id: 'modules',
			label: $localize`Modules`,
			count: this.moduleGroups().reduce((sum, x) => sum + x.total, 0),
		},
	]);
	/** The open tab: kept when another station is picked, so the panel does not jump between tabs. */
	protected readonly tab = linkedSignal<SectorStationRow, DetailTab>({
		source: this.station,
		computation: (_, previous) => previous?.value ?? 'sells',
	});
	protected readonly workforce = computed(() =>
		Object.entries(this.station().save?.workforce ?? {}).map(([race, amount]) => ({
			race,
			name: this.races.getEntity(race)?.name ?? race,
			amount,
		}))
	);

	private offers(sell: boolean): StationOfferRow[] {
		const save = this.station().save;
		return (save ? StationTrade.offers(save, sell) : []).map((x) => {
			const ware = this.wares.getEntity(x.ware);
			return {
				ware: x.ware,
				name: ware?.name ?? x.ware,
				known: !!ware,
				price: x.price,
				amount: x.amount,
				playerOnly: !!x.playerOnly,
			};
		});
	}
}
