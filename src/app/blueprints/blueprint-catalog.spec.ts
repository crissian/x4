import { describe, expect, it } from 'vitest';
import { BlueprintCatalog } from './blueprint-catalog';
import { BlueprintTesting as T } from './blueprint-testing';

describe('BlueprintCatalog', () => {
	const items = BlueprintCatalog.build(
		[T.module('module_b', 'Production'), T.module('module_a', 'Pier'), T.module('module_x', 'Radar')],
		[T.ship('ship_s', 'Small'), T.ship('ship_xen', 'Large')],
		[T.equipment('weapon_a', 'Weapons'), T.equipment('software_a', 'Software')],
		['ship_xen']
	);

	it('lists modules, ships and equipment by name, without software and blueprints the player cannot own', () => {
		expect(items.map((x) => x.id)).toEqual(['module_a', 'module_b', 'module_x', 'ship_s', 'weapon_a']);
	});

	it('maps each item to its category and price', () => {
		const byId = new Map(items.map((x) => [x.id, x]));
		expect(byId.get('module_a')).toMatchObject({ kind: 'module', category: 'module-docks', price: 3 });
		expect(byId.get('module_b')!.category).toBe('module-production');
		expect(byId.get('module_x')!.category).toBe('module-other');
		expect(byId.get('ship_s')).toMatchObject({ kind: 'ship', category: 'ship-small', price: 20 });
		expect(byId.get('weapon_a')).toMatchObject({ kind: 'equipment', category: 'equipment-weapons', price: 20 });
	});

	it('tells blueprints with the same name apart by id', () => {
		const shield = (id: string) => ({ ...T.equipment(id, 'Shields'), name: 'ARG M Shield Generator Mk1' });
		const alike = BlueprintCatalog.build(
			[],
			[],
			[shield('shield_02'), shield('shield_01'), T.equipment('weapon_a', 'Weapons')],
			[]
		);
		expect(alike.map((x) => [x.id, x.variant])).toEqual([
			['shield_01', 'shield_01'],
			['shield_02', 'shield_02'],
			['weapon_a', undefined],
		]);
	});
});
