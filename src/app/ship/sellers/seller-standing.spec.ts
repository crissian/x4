import type { Faction, License } from '../../shared/services/model/model';
import type { LicenseRequirement } from '../../shared/services/ship-stats.service';
import { SellerStanding } from './seller-standing';

const argon = { id: 'argon', name: 'Argon Federation' } as Faction;
const military: License = { type: 'militaryship', name: 'Military Ship Licence', price: 0, minRelation: 0.01 };
const basic: License = { type: 'generaluseship', name: 'Licence', price: 0, minRelation: -0.01 };
const requirement = (license?: License): LicenseRequirement => ({ faction: argon, license });

describe('SellerStanding', () => {
	it('gives only the requirement without a save', () => {
		expect(SellerStanding.of(requirement(military))).toEqual({ status: 'unknown', needed: 10 });
		expect(SellerStanding.of(requirement())).toEqual({ status: 'unknown', needed: undefined });
	});

	it('marks factions at -0.01 or lower as enemies', () => {
		expect(SellerStanding.of(requirement(basic), { argon: -0.01 }).status).toBe('enemy');
		expect(SellerStanding.of(requirement(), { argon: -0.5 }).status).toBe('enemy');
		expect(SellerStanding.of(requirement(basic), { argon: -0.009 }, {}).status).toBe('ok');
	});

	it('counts the missing reputation points', () => {
		// +4 is a relation of 0.0025
		expect(SellerStanding.of(requirement(military), { argon: 0.0025 }, {})).toEqual({
			status: 'reputation',
			needed: 10,
			have: 4,
			missing: 6,
		});
		expect(SellerStanding.of(requirement(military), {}, {})).toMatchObject({
			status: 'reputation',
			have: 0,
			missing: 10,
		});
	});

	it('asks for the ceremony when the reputation is met but the licence is not held', () => {
		expect(SellerStanding.of(requirement(military), { argon: 0.01 }, {}).status).toBe('ceremony');
		expect(SellerStanding.of(requirement(military), { argon: 0.01 }, { militaryship: ['teladi'] }).status).toBe(
			'ceremony'
		);
		expect(
			SellerStanding.of(requirement(military), { argon: 0.01 }, { militaryship: ['argon', 'teladi'] })
		).toEqual({
			status: 'ok',
			needed: 10,
			have: 10,
		});
	});

	it('needs no ceremony for basic licences', () => {
		expect(SellerStanding.of(requirement(basic), { argon: 0 }, {}).status).toBe('ok');
	});

	it('checks the reputation only for saves without licences', () => {
		expect(SellerStanding.of(requirement(military), { argon: 0.02 }).status).toBe('ok');
	});
});
