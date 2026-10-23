import { Component, computed, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { SectorBalances } from '../../economy/sector-balance';
import { HeatMapComponent } from '../../map/heat-map/heat-map.component';
import { JumpTexts } from '../../core/format/jump-texts';
import { WareService } from '../../shared/services/ware.service';
import { SupplyDemandStore } from '../supply-demand-store';
import { NumberFormats } from '../../core/format/number-formats';
import { JumpsPipe } from '../../core/format/jumps.pipe';

/** How many producers and consumers of the ware a sector has. */
interface SectorStations {
	producers: number;
	consumers: number;
}

/**
 * The galaxy map of the selected ware, in two modes. Local colours each sector by its own stations; Reach by the
 * stations within the jumps around it, which is what a station built there could sell or buy. Either way the
 * shade is the net value in Cr per hour on a square-root scale capped at the 95th percentile of the sectors with
 * activity: red for short, green for surplus, deeper with the value. Mined wares have no production in the
 * model, so the map shows the value of what is used, in the red shades. Sectors where nothing is made or used
 * are darker grey. The scope area (the centre and its jumps) is outlined in both modes.
 */
@Component({
	selector: 'app-supply-demand-map',
	imports: [JumpsPipe, HeatMapComponent, FormField],
	templateUrl: './supply-demand-map.component.html',
})
export class SupplyDemandMapComponent {
	private readonly wares = inject(WareService);
	protected readonly store = inject(SupplyDemandStore);
	protected readonly mined = computed(() => !!this.store.selected()?.mined);
	protected readonly reach = computed(() => this.store.mapMode() === 'reach');
	/** The faction and player parts of the scope: what the colours count; the centre only outlines. */
	private readonly counted = computed(() => {
		const { faction, includePlayer } = this.store.scope();
		return { faction, includePlayer };
	});
	/** Jumps the colour of a sector reaches: none in the local mode. */
	private readonly reachJumps = computed(() => (this.reach() ? this.store.jumps() : 0));

	private readonly balances = computed(() => {
		const ware = this.store.selectedWare();
		return ware ? this.store.economy()?.balances(ware, this.reachJumps(), this.counted()) : undefined;
	});
	private readonly price = computed(() => this.wares.getEntity(this.store.selectedWare() ?? '')?.price.avg ?? 0);
	/** Producers and consumers per sector, for the local tooltips. */
	private readonly stations = computed(() => {
		const ware = this.store.selectedWare();
		const found = new Map<string, SectorStations>();
		for (const x of ware ? (this.store.economy()?.wareStations(ware, this.counted()) ?? []) : []) {
			const sector = found.get(x.station.sector) ?? { producers: 0, consumers: 0 };
			sector.producers += x.produced > 0 ? 1 : 0;
			sector.consumers += x.consumed > 0 ? 1 : 0;
			found.set(x.station.sector, sector);
		}
		return found;
	});

	/** The net value of each sector in Cr per hour, or for a mined ware the value of what is used. */
	protected readonly values = computed(() => {
		const balances = this.balances();
		if (!balances) {
			return undefined;
		}
		const mined = this.mined();
		const price = this.price();
		return new Map([...balances].map(([id, x]) => [id, (mined ? -x.consumed : x.net) * price]));
	});
	/** Sectors where nothing is made or used. */
	protected readonly idle = computed(
		() => new Set([...(this.balances() ?? [])].filter(([, x]) => SectorBalances.idle(x)).map(([id]) => id))
	);
	/** The sectors within the jumps of the centre, the area the table sums; empty without a centre. */
	protected readonly area = computed<ReadonlySet<string>>(() => {
		const centre = this.store.centre();
		return (centre && this.store.economy()?.graph.area(centre, this.store.jumps())) || new Set();
	});

	/** The title of a sector: what the colour says, and whether it is in the scope area. */
	protected readonly format = (id: string, name: string) => {
		const title = this.reach() ? this.reachTitle(id, name) : this.localTitle(id, name);
		const centre = this.store.centre();
		return centre && this.area().has(id)
			? `${title} · ${$localize`in the area of ${this.store.sectorName(centre)}:centre:`}`
			: title;
	};

	protected pick(sectorId: string) {
		this.store.setCentre(sectorId);
	}

	private localTitle(id: string, name: string): string {
		const balance = this.balances()?.get(id);
		if (!balance || SectorBalances.idle(balance)) {
			return $localize`${name}:name:: nothing made or used`;
		}
		const stations = this.stations().get(id);
		const consumers = stations?.consumers ?? 0;
		const producers = stations?.producers ?? 0;
		const value = NumberFormats.compact((this.mined() ? -balance.consumed : balance.net) * this.price(), {
			signed: true,
		});
		if (this.mined()) {
			return $localize`${name}:name:: ${value}:value: Cr/h used · consumers: ${consumers}:count:`;
		}
		if (!balance.net) {
			return $localize`${name}:name:: balanced`;
		}
		return balance.net < 0
			? $localize`${name}:name:: ${value}:value: Cr/h short · consumers: ${consumers}:count:`
			: $localize`${name}:name:: ${value}:value: Cr/h surplus · producers: ${producers}:count:`;
	}

	private reachTitle(id: string, name: string): string {
		const balance = this.balances()?.get(id);
		const jumps = this.store.jumps();
		if (!balance || SectorBalances.idle(balance)) {
			return $localize`${name}:name:: nothing made or used`;
		}
		const percent = NumberFormats.signedPercent(SectorBalances.ratio(balance));
		const value = NumberFormats.compact((this.mined() ? -balance.consumed : balance.net) * this.price(), {
			signed: true,
		});
		const within = JumpTexts.within(jumps);
		let title: string;
		if (this.mined()) {
			title = $localize`${name}:name:: ${within}:within: ${value}:value: Cr/h used`;
		} else if (!balance.net) {
			title = $localize`${name}:name:: ${within}:within: balanced`;
		} else if (balance.net < 0) {
			title = $localize`${name}:name:: ${within}:within: ${value}:value: Cr/h short (${percent}:percent:)`;
		} else {
			title = $localize`${name}:name:: ${within}:within: ${value}:value: Cr/h surplus (${percent}:percent:)`;
		}
		const ware = this.store.selectedWare();
		const top = ware && this.store.economy()?.topContributor(ware, id, jumps, this.counted());
		if (!top) {
			return title;
		}
		return top.jumps
			? `${title} · ${$localize`mostly ${this.store.sectorName(top.sector)}:sector:, ${JumpTexts.distance(top.jumps)}:distance:`}`
			: `${title} · ${$localize`mostly this sector`}`;
	}
}
