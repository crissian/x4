import { DecimalPipe } from '@angular/common';
import { EnumLabelPipe, EnumLabels } from '../../core/enum-labels';
import { Component, computed, effect, inject, input, linkedSignal, untracked } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { LucideWrench, LucideX } from '@lucide/angular';
import { LoadoutStats, Loadouts } from '../../shared/services/loadout';
import { LocalStorage } from '../../core/services/local-storage';
import { Ship } from '../../shared/services/model/model';
import { LOADOUT_PRESETS, LoadoutPreset, ShipStatsService } from '../../shared/services/ship-stats.service';
import { ShipService } from '../../shared/services/ship.service';

const STORAGE_KEY = 'ship-compare';
export const MAX_COMPARED = 4;

/** One compared ship: `id` or `id~loadoutCode`. */
interface Entry {
	id: string;
	code?: string;
}

/** A compared ship as edited on the page: a preset, or '' with the custom loadout code. */
interface Selection {
	id: string;
	preset: string;
	custom?: string;
}

interface Column {
	entry: Selection;
	ship: Ship;
	code: string;
	stats: LoadoutStats;
	price: number;
}

interface Row {
	caption: string;
	value: (column: Column) => string | number | null | undefined;
	/** Number rows highlight the best value; `lower` when smaller is better. */
	best?: 'higher' | 'lower';
	format?: string;
}

@Component({
	imports: [DecimalPipe, FormField, RouterLink, LucideX, LucideWrench, EnumLabelPipe],
	templateUrl: './ship-compare.component.html',
})
export class ShipCompareComponent {
	/**
	 * Adds a ship (`id` or `id~loadoutCode`) to the stored comparison, replacing the same ship and
	 * dropping the oldest one above the limit. Returns the value for the `ships` query parameter.
	 */
	static addToComparison(value: string): string {
		const [entry] = ShipCompareComponent.parse(value);
		const entries = [...ShipCompareComponent.readStored().filter((x) => x.id !== entry.id), entry].slice(-MAX_COMPARED);
		ShipCompareComponent.store(entries);
		return ShipCompareComponent.format(entries);
	}

	private readonly shipService = inject(ShipService);
	private readonly stats = inject(ShipStatsService);
	private readonly router = inject(Router);

	readonly ships = input<string>();

	protected readonly presets = LOADOUT_PRESETS;
	protected readonly max = MAX_COMPARED;
	protected readonly allShips = [...this.shipService.getEntities()].sort((a, b) => a.name.localeCompare(b.name));

	protected readonly entries = linkedSignal<Selection[]>(() => {
		const fromUrl = ShipCompareComponent.parse(this.ships());
		return (fromUrl.length ? fromUrl : untracked(() => ShipCompareComponent.readStored()))
			.flatMap((x) => {
				const ship = this.shipService.getEntity(x.id);
				return ship ? [this.toSelection(ship, x.code)] : [];
			})
			.slice(0, MAX_COMPARED);
	});
	protected readonly entriesForm = form(this.entries);

	protected readonly columns = computed<Column[]>(() =>
		this.entries().flatMap((entry) => {
			const ship = this.shipService.getEntity(entry.id);
			if (!ship) {
				return [];
			}
			const loadout = entry.preset
				? this.stats.preset(ship, entry.preset as LoadoutPreset)
				: this.stats.decode(ship, entry.custom);
			const stats = Loadouts.loadoutStats(ship, this.stats.groups(ship), loadout ?? {}, this.stats.getEquipment);
			const code = this.stats.encode(ship, loadout ?? {});
			return [{ entry, ship, code, stats, price: ship.price.avg + stats.equipmentPrice.avg }];
		})
	);

	protected readonly rows: Row[] = [
		{ caption: $localize`Race`, value: (c) => c.ship.race?.name },
		{ caption: $localize`Type`, value: (c) => EnumLabels.label(c.ship.type) },
		{ caption: $localize`Size`, value: (c) => EnumLabels.label(c.ship.size) },
		{ caption: $localize`Purpose`, value: (c) => EnumLabels.label(c.ship.purpose) },
		{ caption: $localize`Hull`, value: (c) => c.ship.hull, best: 'higher' },
		{ caption: $localize`Shield`, value: (c) => c.stats.shield, best: 'higher' },
		{ caption: $localize`Shield recharge (/s)`, value: (c) => c.stats.shieldRecharge, best: 'higher' },
		{ caption: $localize`Speed (m/s)`, value: (c) => c.stats.speeds.speed, best: 'higher' },
		{ caption: $localize`Boost (m/s)`, value: (c) => c.stats.speeds.boost, best: 'higher' },
		{ caption: $localize`Travel (m/s)`, value: (c) => c.stats.speeds.travel, best: 'higher' },
		{ caption: $localize`Cargo`, value: (c) => this.stats.maxStats(c.ship).cargo || null, best: 'higher' },
		{ caption: $localize`Cargo type`, value: (c) => this.stats.maxStats(c.ship).cargoTypes },
		{ caption: $localize`Weapons`, value: (c) => c.ship.weapons?.length ?? 0, best: 'higher' },
		{ caption: $localize`Turrets`, value: (c) => c.ship.turrets?.length ?? 0, best: 'higher' },
		{ caption: $localize`Weapon DPS`, value: (c) => c.stats.weaponDps, best: 'higher' },
		{ caption: $localize`Turret DPS`, value: (c) => c.stats.turretDps, best: 'higher' },
		{
			caption: $localize`Max range (km)`,
			value: (c) => (c.stats.maxRange ? c.stats.maxRange / 1000 : null),
			best: 'higher',
			format: '1.0-1',
		},
		{ caption: $localize`Missiles`, value: (c) => c.ship.storage?.missile, best: 'higher' },
		{ caption: $localize`Drones`, value: (c) => c.ship.storage?.unit, best: 'higher' },
		{ caption: $localize`Crew`, value: (c) => c.ship.people, best: 'higher' },
		{ caption: $localize`Mass (t)`, value: (c) => c.ship.mass, format: '1.0-1' },
		{ caption: $localize`Ship price`, value: (c) => c.ship.price.avg, best: 'lower' },
		{ caption: $localize`Equipment price`, value: (c) => c.stats.equipmentPrice.avg, best: 'lower' },
		{ caption: $localize`Total price`, value: (c) => c.price, best: 'lower' },
	];

	/** Best value per row, only highlighted when at least two ships are compared. */
	protected readonly bestValues = computed(() => {
		const columns = this.columns();
		return this.rows.map((row) => {
			if (!row.best || columns.length < 2) {
				return undefined;
			}
			const values = columns.map((c) => row.value(c)).filter((x): x is number => typeof x === 'number' && x > 0);
			if (values.length < 2) {
				return undefined;
			}
			return row.best === 'higher' ? Math.max(...values) : Math.min(...values);
		});
	});

	constructor() {
		effect(() => {
			const entries = this.columns().map((c) => ({ id: c.ship.id, code: c.code }));
			const value = ShipCompareComponent.format(entries);
			ShipCompareComponent.store(entries);
			untracked(() => {
				if (value !== (this.ships() ?? '')) {
					this.router.navigate([], { queryParams: { ships: value || null }, replaceUrl: true });
				}
			});
		});
	}

	protected isNumber(value: unknown): value is number {
		return typeof value === 'number';
	}

	protected add(id: string) {
		if (id && !this.entries().some((x) => x.id === id)) {
			this.entries.update((entries) => [...entries, { id, preset: 'combat' }].slice(-MAX_COMPARED));
		}
	}

	/** Shows a stored loadout code as its preset when it matches one. */
	private toSelection(ship: Ship, code: string | undefined): Selection {
		if (!code || !this.stats.decode(ship, code)) {
			return { id: ship.id, preset: 'combat' };
		}
		const preset = this.presets.find((p) => this.stats.encode(ship, this.stats.preset(ship, p.id)) === code);
		return preset ? { id: ship.id, preset: preset.id } : { id: ship.id, preset: '', custom: code };
	}

	protected remove(index: number) {
		this.entries.update((entries) => entries.filter((_, i) => i !== index));
	}

	private static parse(value: string | null | undefined): Entry[] {
		return (value ?? '')
			.split(',')
			.filter((x) => x)
			.map((x) => {
				const [id, code] = x.split('~');
				return { id, code: code || undefined };
			});
	}

	private static format(entries: Entry[]): string {
		return entries.map((x) => (x.code ? `${x.id}~${x.code}` : x.id)).join(',');
	}

	private static readStored(): Entry[] {
		return ShipCompareComponent.parse(LocalStorage.read(STORAGE_KEY, '', (x) => (typeof x === 'string' ? x : undefined)));
	}

	private static store(entries: Entry[]) {
		LocalStorage.write(STORAGE_KEY, ShipCompareComponent.format(entries));
	}
}
