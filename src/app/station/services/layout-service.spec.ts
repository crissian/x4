import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { LayoutService } from './layout-service';

describe('layout service', () => {
	beforeEach(() => localStorage.clear());

	it('exports the saved layouts and imports them back, replacing layouts with the same name', () => {
		const service = TestBed.inject(LayoutService);
		service.saveLayout({ name: 'Hull Parts', config: [{ moduleId: 'module_gen_prod_hullparts_01', count: 4 }] });
		service.saveLayout({ name: 'Food', config: [{ moduleId: 'module_arg_prod_foodrations_01', count: 2 }] });
		const exported = service.exportLayouts();

		localStorage.clear();
		service.saveLayout({ name: 'hull parts', config: [] });
		service.saveLayout({ name: 'Other', config: [] });

		expect(service.importLayouts(exported)).toBe(2);
		expect(service.getLayouts().map((x) => [x.name, x.config.length])).toEqual([
			['Hull Parts', 1],
			['Other', 0],
			['Food', 1],
		]);
	});

	it('rejects files that are not exported layouts', () => {
		const service = TestBed.inject(LayoutService);
		expect(() => service.importLayouts('{"version":2,"foo":1}')).toThrow();
		expect(() => service.importLayouts('not json')).toThrow();
	});
});
