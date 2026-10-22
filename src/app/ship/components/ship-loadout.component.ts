import { DecimalPipe } from '@angular/common';
import { Component, computed, effect, inject, input, linkedSignal, signal, untracked } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { LucideCheck, LucideGitCompareArrows, LucideLink } from '@lucide/angular';
import { Loadout, buildWares, loadoutStats, weaponStats } from '../../shared/services/loadout';
import { Equipment } from '../../shared/services/model/model';
import { LOADOUT_PRESETS, LoadoutPreset, ShipStatsService } from '../../shared/services/ship-stats.service';
import { ShipService } from '../../shared/services/ship.service';
import { WareService } from '../../shared/services/ware.service';
import { addToComparison } from './ship-compare.component';

@Component({
	imports: [DecimalPipe, FormField, RouterLink, LucideLink, LucideCheck, LucideGitCompareArrows],
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
	protected readonly groups = computed(() => {
		const ship = this.entity();
		return ship ? this.stats.groups(ship) : [];
	});

	/** Equipment id per slot group, '' for an empty group; edited through the slot selects. */
	protected readonly slots = linkedSignal<Record<string, string>>(() => {
		const ship = this.entity();
		if (!ship) {
			return {};
		}
		return this.toSlots(
			this.stats.decode(
				ship,
				untracked(() => this.l())
			) ?? this.stats.preset(ship, 'combat')
		);
	});
	protected readonly slotsForm = form(this.slots);

	protected readonly loadout = computed<Loadout>(() =>
		Object.fromEntries(Object.entries(this.slots()).filter(([, id]) => id))
	);

	/** Production method used for the ware totals. */
	protected readonly options = signal({ method: 'default' });
	protected readonly optionsForm = form(this.options);
	protected readonly methods = computed(() =>
		(this.entity()?.production ?? []).map((x) => ({ id: x.method, name: x.name }))
	);

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
		return [...buildWares(ship, result.counts, this.stats.getEquipment, this.options().method)]
			.map(([id, amount]) => {
				const ware = this.wares.getEntity(id);
				return { id, ware, amount, value: (ware?.price.avg ?? 0) * amount };
			})
			.sort((a, b) => b.value - a.value);
	});

	protected readonly wareTotalValue = computed(() => this.wareTotals().reduce((a, x) => a + x.value, 0));

	protected readonly equipmentList = computed(() =>
		[...(this.result()?.counts ?? [])].flatMap(([id, count]) => {
			const equipment = this.stats.getEquipment(id);
			return equipment ? [{ equipment, count }] : [];
		})
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

	protected applyPreset(preset: string) {
		const ship = this.entity();
		if (ship && preset) {
			this.slots.set(this.toSlots(this.stats.preset(ship, preset as LoadoutPreset)));
		}
	}

	private toSlots(loadout: Loadout): Record<string, string> {
		return Object.fromEntries(this.groups().map((g) => [g.key, loadout[g.key] ?? '']));
	}

	protected optionLabel(equipment: Equipment): string {
		if (equipment.thrust) {
			return $localize`${equipment.name}:name: - ${Math.round(equipment.thrust.forward)}:thrust: thrust, travel ×${equipment.travel?.thrust ?? 0}:travel:`;
		}
		if (equipment.recharge) {
			return $localize`${equipment.name}:name: - ${equipment.recharge.max.toLocaleString()}:shield: shield, ${equipment.recharge.rate.toLocaleString()}:rate:/s`;
		}
		if (equipment.weapon) {
			const stats = weaponStats(equipment.weapon);
			return $localize`${equipment.name}:name: - ${Math.round(stats.sustainedDps).toLocaleString()}:dps: DPS, ${(stats.range / 1000).toFixed(1)}:range: km`;
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
