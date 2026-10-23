import { describe, expect, it } from 'vitest';
import { WareService } from './ware.service';

describe('WareService', () => {
	it('values the wares at their average prices, unknown ones at nothing', () => {
		const service = new WareService();
		const avg = service.getEntity('energycells')!.price.avg;
		expect(
			service.averageValue([
				{ ware: 'energycells', amount: 10 },
				{ ware: 'no_such_ware', amount: 3 },
			])
		).toBe(10 * avg);
	});
});
