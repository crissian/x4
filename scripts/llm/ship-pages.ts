import type { Ship } from '../../src/app/shared/services/model/model';
import { EntityPages } from './entity-pages';
import { GameData } from './game-data';
import { Markdown } from './markdown';
import { Site } from './site';

export class ShipPages extends EntityPages<Ship> {
	readonly kind = 'ships';
	readonly title = 'Ships';
	readonly summary =
		'Every ship: size, role, hull, cargo, crew, slots, travel speed, price, build cost and who sells it.';

	entities(): Ship[] {
		return GameData.ships;
	}

	page(ship: Ship): string {
		return this.header(ship)
			.facts([
				['Size', ship.size],
				['Type', ship.type],
				['Purpose', ship.purpose],
				['Race', ship.race?.name],
				['Hull', ship.hull],
				['Mass', ship.mass],
				['Cargo', ShipPages.cargo(ship)],
				['Crew capacity', ship.people],
				['Missile storage', ship.storage?.missile],
				['Unit (drone) storage', ship.storage?.unit],
				['Docks', ship.docks?.map((dock) => `${dock.capacity} ${dock.size}`).join(', ')],
				['Engine slots', EntityPages.slots(ship.engines)],
				['Shield slots', EntityPages.slots(ship.shields)],
				['Weapon slots', EntityPages.slots(ship.weapons)],
				['Turret slots', EntityPages.slots(ship.turrets)],
				['Top travel speed (m/s, best fitting engine)', ship.travel?.speed],
				['Travel drive charge (s)', ship.travel?.charge],
				['Explosion damage', ship.explosionDamage],
				['Price', EntityPages.price(ship.price)],
				['License needed', EntityPages.license(ship.license)],
				['Sold by', EntityPages.owners(ship.owners)],
			])
			.section('Build cost', EntityPages.production(ship.production))
			.p(Site.source(this.kind, ship.id))
			.toString();
	}

	index(): string {
		return new Markdown()
			.h1('X4: Foundations ships')
			.p(
				'Cargo is in m³; travel speed in m/s with the fastest engine that fits; price is the average in credits.'
			)
			.table(
				['Ship', 'Size', 'Type', 'Race', 'Hull', 'Cargo', 'Travel speed', 'Price'],
				[...this.entities()]
					.sort((a, b) => a.name.localeCompare(b.name))
					.map((ship) => [
						this.link(ship),
						ship.size,
						ship.type,
						ship.race?.name,
						ship.hull,
						ShipPages.cargo(ship),
						Markdown.num(ship.travel?.speed, 0),
						Markdown.num(ship.price?.avg, 0),
					])
			)
			.toString();
	}

	private static cargo(ship: Ship): string | undefined {
		return ship.cargo
			?.map((cargo) => `${Markdown.num(cargo.max)} ${cargo.types.map((type) => type.name).join('/')}`)
			.join(', ');
	}
}
