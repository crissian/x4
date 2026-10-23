import type { Equipment } from '../../src/app/shared/services/model/model';
import { EntityPages } from './entity-pages';
import { GameData } from './game-data';
import { type Fact, Markdown } from './markdown';
import { Site } from './site';

export class EquipmentPages extends EntityPages<Equipment> {
	readonly kind = 'equipment';
	readonly title = 'Equipment';
	readonly summary =
		'Weapons, turrets, missiles, shields, engines, thrusters, drones, software: combat and drive stats, price, build cost.';

	/** Labels with units of the stat fields, from the model docs; other fields get their name split into words. */
	private static readonly labels: Record<string, string> = {
		'recharge.max': 'Shield capacity',
		'recharge.rate': 'Shield recharge (per s)',
		'recharge.delay': 'Recharge delay after damage (s)',
		'travel.thrust': 'Travel speed (x forward thrust)',
		'travel.charge': 'Travel drive charge (s)',
		'boost.thrust': 'Boost speed (x forward thrust)',
		'boost.duration': 'Boost duration (s)',
		'weapon.damage': 'Damage (per projectile, per second for beams)',
		'weapon.shield': 'Extra damage to shields',
		'weapon.hull': 'Extra damage to hull',
		'weapon.amount': 'Projectiles per shot',
		'weapon.speed': 'Projectile speed (m/s)',
		'weapon.lifetime': 'Projectile lifetime (s)',
		'weapon.range': 'Range (m)',
		'weapon.rate': 'Shots per second',
		'weapon.reload': 'Seconds between shots',
		'weapon.chargeTime': 'Charge time (s)',
		'missile.range': 'Range (m)',
		'missile.lifetime': 'Lifetime (s)',
		'missile.speed': 'Speed (m/s)',
		'missile.amount': 'Missiles per launch',
		'missile.reload': 'Seconds between launches',
		'missile.lock': 'Lock-on time (s)',
		'thrust.forward': 'Forward thrust',
		'thrust.reverse': 'Reverse thrust',
	};

	entities(): Equipment[] {
		return GameData.equipment;
	}

	page(equipment: Equipment): string {
		return this.header(equipment)
			.facts([
				['Type', equipment.type],
				['Class', equipment.equipmentClass],
				['Size', equipment.size],
				['Race', equipment.race?.name],
				['Hull', equipment.hull],
				...EquipmentPages.stats(equipment),
				['Explosion damage', equipment.explosionDamage],
				['Price', EntityPages.price(equipment.price)],
				['License needed', EntityPages.license(equipment.license)],
				['Sold by', EntityPages.owners(equipment.owners)],
			])
			.section('Build cost', EntityPages.production(equipment.production))
			.p(Site.source(this.kind, equipment.id))
			.toString();
	}

	index(): string {
		const markdown = new Markdown().h1('X4: Foundations equipment');
		const types = [...new Set(this.entities().map((equipment) => equipment.type ?? 'Other'))].sort();
		for (const type of types) {
			markdown.h2(type).table(
				['Equipment', 'Class', 'Size', 'Race', 'Price'],
				this.entities()
					.filter((equipment) => (equipment.type ?? 'Other') === type)
					.sort((a, b) => a.name.localeCompare(b.name))
					.map((equipment) => [
						this.link(equipment),
						equipment.equipmentClass,
						equipment.size,
						equipment.race?.name,
						Markdown.num(equipment.price?.avg, 0),
					])
			);
		}
		return markdown.toString();
	}

	/** The stat groups the equipment has (weapon, missile, shield, drive, ...) as one fact per field. */
	private static stats(equipment: Equipment): Fact[] {
		const groups = ['thrust', 'recharge', 'travel', 'boost', 'thruster', 'weapon', 'missile', 'launcher'] as const;
		return groups.flatMap((group) => EquipmentPages.flatten(group, equipment[group]));
	}

	private static flatten(path: string, value: unknown): Fact[] {
		if (value == null) {
			return [];
		}
		if (Array.isArray(value)) {
			return [[EquipmentPages.label(path), value.join(', ')]];
		}
		if (typeof value === 'object') {
			return Object.entries(value).flatMap(([key, child]) => EquipmentPages.flatten(`${path}.${key}`, child));
		}
		if (path === 'launcher.missile') {
			return [['Comes with missile', GameData.name(String(value))]];
		}
		return [[EquipmentPages.label(path), value as string | number | boolean]];
	}

	private static label(path: string): string {
		return (
			EquipmentPages.labels[path] ??
			path
				.split('.')
				.map((part) => part.replace(/([A-Z])/g, ' $1').toLowerCase())
				.join(' ')
				.replace(/^./, (first) => first.toUpperCase())
		);
	}
}
