import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, computed, effect, inject, input, linkedSignal, signal, untracked } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LucideCheck, LucideGitCompareArrows, LucideLink } from '@lucide/angular';
import { Loadout, SlotGroup, buildWares, loadoutStats, weaponStats } from '../../shared/services/loadout';
import { Equipment } from '../../shared/services/model/model';
import { LOADOUT_PRESETS, LoadoutPreset, ShipStatsService } from '../../shared/services/ship-stats.service';
import { ShipService } from '../../shared/services/ship.service';
import { WareService } from '../../shared/services/ware.service';
import { addToComparison } from './ship-compare.component';

@Component({
	imports: [DecimalPipe, TitleCasePipe, RouterLink, LucideLink, LucideCheck, LucideGitCompareArrows],
	templateUrl: './ship-loadout.component.html',
})
export class ShipLoadoutComponent {
	private readonly ships = inject(ShipService);
	private readonly wares = inject(WareService);
	private readonly stats = inject(ShipStatsService);
	private readonly router = inject(Router);

	readonly id = input.required<string>();
	/** Encoded loadout from the `?l=` query parameter. */
	readonly l = input<string>();

	protected readonly presets = LOADOUT_PRESETS;
	protected readonly entity = computed(() => this.ships.getEntity(this.id()));
	protected readonly groups = computed(() => (this.entity() ? this.stats.groups(this.entity()) : []));

	protected readonly loadout = linkedSignal<Loadout>(() => {
		const ship = this.entity();
		if (!ship) {
			return {};
		}
		return this.stats.decode(ship, untracked(() => this.l())) ?? this.stats.preset(ship, 'combat');
	});

	/** Production method used for the ware totals. */
	protected readonly method = signal('default');
	protected readonly methods = computed(() => (this.entity()?.production ?? []).map((x) => ({ id: x.method, name: x.name })));

	protected readonly result = computed(() => {
		const ship = this.entity();
		return ship ? loadoutStats(ship, this.groups(), this.loadout(), this.stats.getEquipment) : undefined;
	});

	protected readonly price = computed(() => {
		const ship = this.entity();
		const equipment = this.result()?.equipmentPrice;
		if (!ship || !equipment) {
			return undefined;
		}
		return {
			min: ship.price.min + equipment.min,
			avg: ship.price.avg + equipment.avg,
			max: ship.price.max + equipment.max,
		};
	});

	protected readonly wareTotals = computed(() => {
		const ship = this.entity();
		const result = this.result();
		if (!ship || !result) {
			return [];
		}
		return [...buildWares(ship, result.counts, this.stats.getEquipment, this.method())]
			.map(([id, amount]) => {
				const ware = this.wares.getEntity(id);
				return { id, ware, amount, value: (ware?.price.avg ?? 0) * amount };
			})
			.sort((a, b) => b.value - a.value);
	});

	protected readonly wareTotalValue = computed(() => this.wareTotals().reduce((a, x) => a + x.value, 0));

	protected readonly equipmentList = computed(() =>
		[...(this.result()?.counts ?? [])].map(([id, count]) => ({ equipment: this.stats.getEquipment(id), count }))
	);

	protected readonly copied = signal(false);

	constructor() {
		// keep the loadout in the address bar so it can be bookmarked and shared
		effect(() => {
			const ship = this.entity();
			const loadout = this.loadout();
			if (ship) {
				const code = this.stats.encode(ship, loadout);
				untracked(() => {
					if (code !== this.l()) {
						this.router.navigate([], { queryParams: { l: code }, replaceUrl: true });
					}
				});
			}
		});
	}

	protected select(group: SlotGroup, id: string) {
		this.loadout.update((loadout) => {
			const next = { ...loadout };
			if (id) {
				next[group.key] = id;
			} else {
				delete next[group.key];
			}
			return next;
		});
	}

	protected applyPreset(preset: string) {
		const ship = this.entity();
		if (ship && preset) {
			this.loadout.set(this.stats.preset(ship, preset as LoadoutPreset));
		}
	}

	protected optionLabel(equipment: Equipment): string {
		if (equipment.thrust) {
			return `${equipment.name} - ${Math.round(equipment.thrust.forward)} thrust, travel ×${equipment.travel?.thrust ?? 0}`;
		}
		if (equipment.recharge) {
			return `${equipment.name} - ${equipment.recharge.max.toLocaleString()} shield, ${equipment.recharge.rate.toLocaleString()}/s`;
		}
		if (equipment.weapon) {
			const stats = weaponStats(equipment.weapon);
			return `${equipment.name} - ${Math.round(stats.sustainedDps).toLocaleString()} DPS, ${(stats.range / 1000).toFixed(1)} km`;
		}
		return equipment.name;
	}

	protected async copyLink() {
		try {
			await navigator.clipboard.writeText(location.href);
			this.copied.set(true);
			setTimeout(() => this.copied.set(false), 2000);
		} catch {
			// clipboard not available: the address bar already holds the link
		}
	}

	protected compare() {
		const ship = this.entity();
		if (ship) {
			const code = this.stats.encode(ship, this.loadout());
			this.router.navigate(['/ships/compare'], { queryParams: { ships: addToComparison(`${ship.id}~${code}`) } });
		}
	}
}
