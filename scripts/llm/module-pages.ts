import type { StationModule } from '../../src/app/shared/services/model/model';
import { EntityPages } from './entity-pages';
import { GameData } from './game-data';
import { Markdown } from './markdown';
import { Site } from './site';

export class ModulePages extends EntityPages<StationModule> {
	readonly kind = 'modules';
	readonly title = 'Station modules';
	readonly summary =
		'Every station module: type, what it produces, workforce, storage, docks, defences, price, build cost and who sells the blueprint.';

	entities(): StationModule[] {
		return GameData.modules;
	}

	page(module: StationModule): string {
		const workForce = module.workForce;
		return this.header(module)
			.facts([
				['Type', module.type],
				['Maker race', module.makerRace?.name],
				['Products', module.product?.map((ware) => this.link(ware, 'wares')).join(', ')],
				[
					'Production queue',
					module.queue?.map((item) => `${this.link(item.ware, 'wares')} (\`${item.method}\`)`).join(', '),
				],
				[
					'Processes recyclables into',
					module.processing
						?.map((item) => `${Markdown.num(item.amount)} ${this.link(item.ware, 'wares')} per cycle`)
						.join(', '),
				],
				['Workforce needed', workForce?.max],
				['Workforce housed', workForce?.capacity],
				['Workforce race', workForce?.race?.name],
				['Storage', module.cargo && `${Markdown.num(module.cargo.max)} m³ ${module.cargo.type.name}`],
				['Docks', module.docks?.map((dock) => `${dock.capacity} ${dock.size}`).join(', ')],
				['Shield slots', EntityPages.slots(module.shields)],
				['Turret slots', EntityPages.slots(module.turrets)],
				['Hull', module.hull],
				[
					'Size (m)',
					module.dimensions &&
						`${Markdown.num(module.dimensions.x)} x ${Markdown.num(module.dimensions.y)} x ${Markdown.num(module.dimensions.z)}`,
				],
				['Price', EntityPages.price(module.price)],
				['License needed', EntityPages.license(module.license)],
				['Blueprint sold by', EntityPages.owners(module.owners)],
			])
			.section('Build cost', EntityPages.production(module.production))
			.p(Site.source(this.kind, module.id))
			.toString();
	}

	private static workForce(module: StationModule): string | undefined {
		const workForce = module.workForce;
		if (workForce?.max) {
			return `${Markdown.num(workForce.max)} needed`;
		}
		return workForce?.capacity ? `${Markdown.num(workForce.capacity)} housed` : undefined;
	}

	index(): string {
		const markdown = new Markdown().h1('X4: Foundations station modules');
		const types = [...new Set(this.entities().map((module) => module.type))].sort();
		for (const type of types) {
			markdown.h2(type).table(
				['Module', 'Race', 'Products', 'Workforce', 'Price'],
				this.entities()
					.filter((module) => module.type === type)
					.sort((a, b) => a.name.localeCompare(b.name))
					.map((module) => [
						this.link(module),
						module.makerRace?.name,
						module.product?.map((ware) => ware.name).join(', '),
						ModulePages.workForce(module),
						Markdown.num(module.price?.avg, 0),
					])
			);
		}
		return markdown.toString();
	}
}
