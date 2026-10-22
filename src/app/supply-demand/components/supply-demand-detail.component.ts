import { DecimalPipe, formatNumber } from '@angular/common';
import { Component, LOCALE_ID, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { WareStationFlow } from '../../economy/economy-model';
import { WareService } from '../../shared/services/ware.service';
import { ToneDotComponent } from '../../shared/components/tone-dot/tone-dot.component';
import { SupplyDemandDetail, StationOffer } from '../supply-demand-detail';
import { SupplyDemandDiagnosis } from '../supply-demand-diagnosis';
import { SupplyDemandStore } from '../supply-demand-store';

/** An input of the selected ware and its net per hour in the scope. */
export interface InputSupply {
	ware: string;
	name: string;
	/** undefined for mined wares, whose mining is not counted */
	net?: number;
	/** the net in Cr per hour */
	value?: number;
}

/** The stations, inputs and offers behind the selected ware. */
@Component({
	selector: 'app-supply-demand-detail',
	imports: [DecimalPipe, RouterLink, ToneDotComponent],
	templateUrl: './supply-demand-detail.component.html',
})
export class SupplyDemandDetailComponent {
	protected readonly store = inject(SupplyDemandStore);
	protected readonly compact = SupplyDemandDetail.compact;
	protected readonly diagnosis = SupplyDemandDiagnosis;
	private readonly wares = inject(WareService);
	private readonly locale = inject(LOCALE_ID);

	private readonly flows = computed(() => {
		const ware = this.store.selectedWare();
		return ware ? (this.store.economy()?.wareStations(ware, this.store.scope()) ?? []) : [];
	});
	protected readonly producers = computed<WareStationFlow[]>(() => SupplyDemandDetail.producers(this.flows()));
	protected readonly consumers = computed<WareStationFlow[]>(() => SupplyDemandDetail.consumers(this.flows()));

	/** The inputs of the ware's main recipe, with their net in the scope (the centre and its jumps, else all). */
	protected readonly inputs = computed<InputSupply[]>(() => {
		const ware = this.wares.getEntity(this.store.selectedWare() ?? '');
		const recipe = ware?.production?.find((x) => x.method === 'default') ?? ware?.production?.[0];
		const rows = new Map((this.store.economy()?.rows(this.store.scope()) ?? []).map((x) => [x.ware, x]));
		return (recipe?.wares ?? []).map((x) => {
			const row = rows.get(x.ware);
			return {
				ware: x.ware,
				name: this.wares.getEntity(x.ware)?.name ?? x.ware,
				net: row?.mined ? undefined : (row?.net ?? 0),
				value: row?.mined ? undefined : (row?.net ?? 0) * (this.wares.getEntity(x.ware)?.price.avg ?? 0),
			};
		});
	});

	private readonly stations = computed(() => this.store.economy()?.stationsIn(this.store.scope()) ?? []);
	protected readonly sellers = computed<StationOffer[]>(() => this.offers(true));
	protected readonly buyers = computed<StationOffer[]>(() => this.offers(false));

	/** Tooltip of an input's net; a plain `$localize` keeps the i18n attribute runtime out of the initial bundle. */
	protected perHour(net: number): string {
		return $localize`${formatNumber(net, this.locale, '1.0-0')}:INTERPOLATION: per hour`;
	}

	private offers(sell: boolean): StationOffer[] {
		const ware = this.store.selectedWare();
		return ware
			? SupplyDemandDetail.offers(
					this.stations().map((x) => x.station),
					ware,
					sell
				)
			: [];
	}
}
