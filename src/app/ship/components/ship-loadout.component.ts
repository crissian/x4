import { DecimalPipe } from '@angular/common';
import { Component, computed, effect, inject, input, linkedSignal, signal, untracked } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { LucideCheck, LucideGitCompareArrows, LucideLink } from '@lucide/angular';
import { EquipmentService } from '../../shared/services/equipment.service';
import { Loadouts, Loadout } from '../../shared/services/loadout';
import { LoadoutMissiles } from '../../shared/services/loadout-missiles';
import { ShipPerformance } from '../../shared/services/ship-performance';
import { Equipment, Ship } from '../../shared/services/model/model';
import { LOADOUT_PRESETS, LoadoutPreset, ShipStatsService } from '../../shared/services/ship-stats.service';
import { ShipService } from '../../shared/services/ship.service';
import { WareService } from '../../shared/services/ware.service';
import { ShipCompareComponent } from './ship-compare.component';
import { NumberFormats } from '../../core/format/number-formats';
import { EntityDetailPage } from '../../shared/components/entity-detail-page';
import { PriceRangePipe } from '../../core/format/price-range.pipe';

@Component({
	imports: [DecimalPipe, PriceRangePipe, FormField, RouterLink, LucideLink, LucideCheck, LucideGitCompareArrows],
	templateUrl: './ship-loadout.component.html',
})
export class ShipLoadoutComponent extends EntityDetailPage<Ship> {
	protected readonly service = inject(ShipService);
	private readonly wares = inject(WareService);
	private readonly stats = inject(ShipStatsService);
	private readonly equipment = inject(EquipmentService);
	private readonly router = inject(Router);

	/** Encoded loadout from the `?l=` query parameter. */
	readonly l = input<string>();

	protected readonly presets = LOADOUT_PRESETS;
	protected readonly groups = computed(() => {
		const ship = this.entity();
		return ship ? this.stats.groups(ship) : [];
	});

	/**
	 * Equipment id per slot group, '' for an empty group, and the missile per launcher group ('' for
	 * the launcher's default); edited through the slot selects.
	 */
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

	/** Missile select of every group that holds a launcher now: its loadout key, default missile and choices. */
	protected readonly missileChoices = computed(() => {
		const slots = this.slots();
		const choices = new Map<string, { key: string; default?: Equipment; options: Equipment[] }>();
		for (const group of this.groups().filter((x) => LoadoutMissiles.isLauncherGroup(x))) {
			const launcher = slots[group.key] ? this.stats.getEquipment(slots[group.key])?.launcher : undefined;
			if (launcher) {
				choices.set(group.key, {
					key: LoadoutMissiles.key(group),
					default: this.stats.getEquipment(launcher.missile),
					options: LoadoutMissiles.compatible(launcher, this.equipment.getEntities()),
				});
			}
		}
		return choices;
	});

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
		return ship ? Loadouts.loadoutStats(ship, this.groups(), this.loadout(), this.stats.getEquipment) : undefined;
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
		return [...Loadouts.buildWares(ship, result.counts, this.stats.getEquipment, this.options().method)]
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
		super();
		// a missile the new launcher does not accept goes back to the launcher's default
		effect(() => {
			const slots = this.slots();
			const reset = this.groups()
				.filter((x) => LoadoutMissiles.isLauncherGroup(x))
				.map((x) => ({ key: LoadoutMissiles.key(x), choice: this.missileChoices().get(x.key) }))
				.filter(({ key, choice }) => slots[key] && !choice?.options.some((x) => x.id === slots[key]));
			if (reset.length) {
				untracked(() => this.slots.update((x) => ({ ...x, ...Object.fromEntries(reset.map(({ key }) => [key, ''])) })));
			}
		});

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
		const missileKeys = this.groups()
			.filter((g) => LoadoutMissiles.isLauncherGroup(g))
			.map((g) => LoadoutMissiles.key(g));
		return Object.fromEntries([...this.groups().map((g) => g.key), ...missileKeys].map((key) => [key, loadout[key] ?? '']));
	}

	protected missileLabel(missile: Equipment): string {
		const data = missile.missile;
		if (!data) {
			return missile.name;
		}
		const dps = NumberFormats.whole(LoadoutMissiles.stats(data).sustainedDps);
		const range = NumberFormats.km(data.range);
		return data.lock
			? $localize`${missile.name}:name: - ${dps}:dps: DPS, ${range}:range: km, lock ${data.lock}:lock: s`
			: $localize`${missile.name}:name: - ${dps}:dps: DPS, ${range}:range: km`;
	}

	protected optionLabel(equipment: Equipment): string {
		if (equipment.thrust) {
			return $localize`${equipment.name}:name: - ${Math.round(equipment.thrust.forward)}:thrust: thrust, travel ×${equipment.travel?.thrust ?? 0}:travel:`;
		}
		if (equipment.thruster) {
			return $localize`${equipment.name}:name: - ${Math.round(equipment.thruster.strafe)}:strafe: strafe, ${Math.round(equipment.thruster.pitch)}:pitch: pitch`;
		}
		if (equipment.recharge) {
			return $localize`${equipment.name}:name: - ${NumberFormats.format(equipment.recharge.max, {})}:shield: shield, ${NumberFormats.format(equipment.recharge.rate, {})}:rate:/s`;
		}
		if (equipment.weapon) {
			const stats = ShipPerformance.weaponStats(equipment.weapon);
			return $localize`${equipment.name}:name: - ${NumberFormats.whole(stats.sustainedDps)}:dps: DPS, ${NumberFormats.km(stats.range)}:range: km`;
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
			this.router.navigate(['/ships/compare'], { queryParams: { ships: ShipCompareComponent.addToComparison(`${ship.id}~${code}`) } });
		}
	}
}
