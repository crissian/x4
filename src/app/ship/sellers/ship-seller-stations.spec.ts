import type { SaveMap, SaveStation } from '../../savegame/map/save-map-model';
import { Size } from '../../shared/services/data/size-data';
import type { Faction, GodStation, Ship } from '../../shared/services/model/model';
import { ShipSellerStations } from './ship-seller-stations';

const faction = (id: string) => ({ id }) as Faction;
const ship = (size: Size, ...owners: string[]) => ({ id: 'ship', size, owners: owners.map(faction) }) as Ship;
const god = (id: string, type: GodStation['type'], owner: string) =>
	({ id, type, owner, sector: `sector_${id}`, version: 0 }) as GodStation;

const GAME_START: GodStation[] = [
	god('shipyard_argon_01', 'shipyard', 'argon'),
	god('wharf_argon_01', 'wharf', 'argon'),
	god('equipmentdock_argon_01', 'equipmentdock', 'argon'),
	god('shipyard_paranid', 'shipyard', 'paranid'),
	god('shipyard_alliance', 'shipyard', 'alliance'),
];

function station(code: string, modules: string[], extra: Partial<SaveStation> = {}): SaveStation {
	return { code, macro: 'station', owner: 'argon', sector: 's1', x: 0, z: 0, known: true, modules, ...extra };
}

describe('ShipSellerStations', () => {
	it('lists the game start stations of the selling factions that build the size', () => {
		expect(ShipSellerStations.fromGameStart(ship(Size.large, 'argon', 'alliance'), GAME_START)).toEqual([
			{
				id: 'shipyard_argon_01',
				type: 'shipyard',
				owner: 'argon',
				sector: 'sector_shipyard_argon_01',
				known: true,
			},
		]);
		expect(ShipSellerStations.fromGameStart(ship(Size.medium, 'argon'), GAME_START).map((x) => x.id)).toEqual([
			'wharf_argon_01',
		]);
		expect(
			ShipSellerStations.fromGameStart(ship(Size.extralarge, 'alliance'), GAME_START).map((x) => x.id)
		).toEqual(['shipyard_alliance']);
	});

	it('finds nothing for ships without selling factions or extra small ships', () => {
		expect(ShipSellerStations.fromGameStart({ id: 'x', size: Size.large } as Ship, GAME_START)).toEqual([]);
		expect(ShipSellerStations.fromGameStart(ship(Size.extrasmall, 'argon'), GAME_START)).toEqual([]);
	});

	it('lists the save stations by their build modules, skipping player stations, wrecks and construction sites', () => {
		const map: SaveMap = {
			sectors: [],
			playerShips: {},
			stations: [
				station('YARD', ['buildmodule_gen_ships_l', 'buildmodule_gen_ships_xl'], { known: false }),
				station('WHARF', ['buildmodule_arg_ships_m_dockarea_01']),
				station('MINE', ['buildmodule_gen_ships_l'], { owner: 'player' }),
				station('WRECK', ['buildmodule_gen_ships_l'], { state: 'wreck' }),
				station('BUILDING', ['buildmodule_gen_ships_l'], { state: 'construction' }),
				station('XEN', ['buildmodule_xen_ships_xl'], { owner: 'xenon' }),
			],
		};
		const large = ShipSellerStations.fromSave(ship(Size.large, 'argon', 'player'), map);
		expect(large.map((x) => [x.id, x.type, x.known])).toEqual([['YARD', 'shipyard', false]]);
		expect(large[0].save?.code).toBe('YARD');
		expect(ShipSellerStations.fromSave(ship(Size.small, 'argon'), map).map((x) => [x.id, x.type])).toEqual([
			['WHARF', 'wharf'],
		]);
	});
});
