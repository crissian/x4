import type { SaveMap, SaveOffer, SaveStation } from '../savegame/map/save-map-model';
import type { Sector } from '../shared/services/model/model';
import { ModuleService } from '../shared/services/module.service';
import { WareService } from '../shared/services/ware.service';
import { TradeRouteTesting } from '../trade/trade-route-testing';
import { Economy } from './economy';
import type { BuildingMaterials } from './ware-classes';

/** Test fixtures: sectors a <-> b <-> c (b has half the sunlight) plus x without gates, over the real ware data. Modules are named as a save does (macro without `_macro`). */
export class EconomyTesting {
	static readonly ENERGY = 'prod_gen_energycells';
	static readonly HULL_PARTS = 'prod_gen_hullparts';
	/** room for 500 argon workers */
	static readonly HABITAT = 'hab_arg_m_01';

	static readonly wares = new WareService();
	static readonly modules = new ModuleService();

	static readonly SECTORS: readonly Sector[] = [
		{ ...TradeRouteTesting.sector('a', ['b']), sunlight: 1 },
		{ ...TradeRouteTesting.sector('b', ['a', 'c']), sunlight: 0.5 },
		TradeRouteTesting.sector('c', ['b']),
		TradeRouteTesting.sector('x', []),
	];

	static price(ware: string): number {
		return EconomyTesting.wares.getEntity(ware)?.price.avg ?? 0;
	}

	static station(
		code: string,
		sector: string,
		extra: Partial<SaveStation> = {},
		offers: SaveOffer[] = []
	): SaveStation {
		return TradeRouteTesting.station(code, sector, offers, extra);
	}

	static economy(stations: SaveStation[], building?: BuildingMaterials): Economy {
		const map: SaveMap = TradeRouteTesting.map(stations);
		return new Economy(map, EconomyTesting.wares, EconomyTesting.modules, EconomyTesting.SECTORS, building);
	}
}
