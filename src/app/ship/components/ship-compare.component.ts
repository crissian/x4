import { DecimalPipe } from '@angular/common';
import { Component, computed, effect, inject, input, linkedSignal, untracked } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LucideWrench, LucideX } from '@lucide/angular';
import { LoadoutStats, loadoutStats } from '../../shared/services/loadout';
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

function parse(value: string | null | undefined): Entry[] {
	return (value ?? '')
		.split(',')
		.filter((x) => x)
		.map((x) => {
			const [id, code] = x.split('~');
			return { id, code: code || undefined };
		});
}

function format(entries: Entry[]): string {
	return entries.map((x) => (x.code ? `${x.id}~${x.code}` : x.id)).join(',');
}

function readStored(): Entry[] {
	try {
		return parse(localStorage.getItem(STORAGE_KEY));
	} catch {
		return [];
	}
}

function store(entries: Entry[]) {
	try {
		localStorage.setItem(STORAGE_KEY, format(entries));
	} catch {
		// storage unavailable: the URL still holds the comparison
	}
}

/**
 * Adds a ship (`id` or `id~loadoutCode`) to the stored comparison, replacing the same ship and
 * dropping the oldest one above the limit. Returns the value for the `ships` query parameter.
 */
export function addToComparison(value: string): string {
	const [entry] = parse(value);
	const entries = [...readStored().filter((x) => x.id !== entry.id), entry].slice(-MAX_COMPARED);
	store(entries);
	return format(entries);
}

interface Column {
	entry: Entry;
	ship: Ship;
	preset: string;
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
	imports: [DecimalPipe, RouterLink, LucideX, LucideWrench],
	templateUrl: './ship-compare.component.html',
})
export class ShipCompareComponent {
	private readonly shipService = inject(ShipService);
	private readonly stats = inject(ShipStatsService);
	private readonly router = inject(Router);

	readonly ships = input<string>();

	protected readonly presets = LOADOUT_PRESETS;
	protected readonly max = MAX_COMPARED;
	protected readonly allShips = [...this.shipService.getEntities()].sort((a, b) => a.name.localeCompare(b.name));

	protected readonly entries = linkedSignal<Entry[]>(() => {
		const fromUrl = parse(this.ships());
		return (fromUrl.length ? fromUrl : readStored()).filter((x) => this.shipService.getEntity(x.id)).slice(0, MAX_COMPARED);
	});

	protected readonly columns = computed<Column[]>(() =>
		this.entries().map((entry) => {
			const ship = this.shipService.getEntity(entry.id);
			const decoded = this.stats.decode(ship, entry.code);
			const loadout = decoded ?? this.stats.preset(ship, 'combat');
			const stats = loadoutStats(ship, this.stats.groups(ship), loadout, this.stats.getEquipment);
			const preset = decoded ? (this.presets.find((p) => this.stats.encode(ship, this.stats.preset(ship, p.id)) === entry.code)?.id ?? '') : 'combat';
			return { entry, ship, preset, stats, price: ship.price.avg + stats.equipmentPrice.avg };
		})
	);

	protected readonly rows: Row[] = [
		{ caption: 'Race', value: (c) => c.ship.race?.name },
		{ caption: 'Type', value: (c) => c.ship.type },
		{ caption: 'Size', value: (c) => c.ship.size },
		{ caption: 'Purpose', value: (c) => c.ship.purpose },
		{ caption: 'Hull', value: (c) => c.ship.hull, best: 'higher' },
		{ caption: 'Shield', value: (c) => c.stats.shield, best: 'higher' },
		{ caption: 'Shield recharge (/s)', value: (c) => c.stats.shieldRecharge, best: 'higher' },
		{ caption: 'Speed (m/s)', value: (c) => c.stats.speeds.speed, best: 'higher' },
		{ caption: 'Boost (m/s)', value: (c) => c.stats.speeds.boost, best: 'higher' },
		{ caption: 'Travel (m/s)', value: (c) => c.stats.speeds.travel, best: 'higher' },
		{ caption: 'Cargo', value: (c) => this.stats.maxStats(c.ship).cargo || null, best: 'higher' },
		{ caption: 'Cargo type', value: (c) => this.stats.maxStats(c.ship).cargoTypes },
		{ caption: 'Weapons', value: (c) => c.ship.weapons?.length ?? 0, best: 'higher' },
		{ caption: 'Turrets', value: (c) => c.ship.turrets?.length ?? 0, best: 'higher' },
		{ caption: 'Weapon DPS', value: (c) => c.stats.weaponDps, best: 'higher' },
		{ caption: 'Turret DPS', value: (c) => c.stats.turretDps, best: 'higher' },
		{ caption: 'Max range (km)', value: (c) => (c.stats.maxRange ? c.stats.maxRange / 1000 : null), best: 'higher', format: '1.0-1' },
		{ caption: 'Missiles', value: (c) => c.ship.storage?.missile, best: 'higher' },
		{ caption: 'Drones', value: (c) => c.ship.storage?.unit, best: 'higher' },
		{ caption: 'Crew', value: (c) => c.ship.people, best: 'higher' },
		{ caption: 'Mass (t)', value: (c) => c.ship.mass, format: '1.0-1' },
		{ caption: 'Ship price', value: (c) => c.ship.price.avg, best: 'lower' },
		{ caption: 'Equipment price', value: (c) => c.stats.equipmentPrice.avg, best: 'lower' },
		{ caption: 'Total price', value: (c) => c.price, best: 'lower' },
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
			const value = format(this.entries());
			store(this.entries());
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
			this.entries.update((entries) => [...entries, { id }].slice(-MAX_COMPARED));
		}
	}

	protected remove(index: number) {
		this.entries.update((entries) => entries.filter((_, i) => i !== index));
	}

	protected setPreset(index: number, preset: string) {
		this.entries.update((entries) =>
			entries.map((entry, i) => {
				if (i !== index) {
					return entry;
				}
				const ship = this.shipService.getEntity(entry.id);
				return { id: entry.id, code: this.stats.encode(ship, this.stats.preset(ship, preset as LoadoutPreset)) };
			})
		);
	}

	protected loadoutCode(column: Column): string {
		return column.entry.code ?? this.stats.encode(column.ship, this.stats.preset(column.ship, 'combat'));
	}
}
