import { RomanNumeral } from '../../core/format/roman';
import { GameTextRef } from '../../core/game-text-ref';
import { ModuleTypes } from '../../shared/services/data/module-types-data';
import type { SaveStation } from './save-map-model';
import { StationTypes, type StationModuleInfo, type StationTypeId } from './station-type';

/** Lookups the naming rules need; each already translated, so no data is imported here. */
export interface NamingTables {
	factionShort(owner: string): string | undefined;
	sectorName(sector: string): string | undefined;
	/** resolves a `{page,id}` reference */
	text(ref: string): string | undefined;
	macroName(macro: string): string | undefined;
	wareFactoryName(ware: string): string | undefined;
	wareGroup(ware: string): { factoryName: string; priority: number } | undefined;
	/** gets a lowercase module id */
	module(id: string): StationModuleInfo | undefined;
}

type ModuleInfos = (StationModuleInfo | undefined)[];

export class StationNamer {
	private static readonly TEXT_FACTORY = '{20102,1001}';
	private static readonly TEXT_DEFENCE = '{20102,1041}';
	private static readonly TEXT_SCRAP = '{20102,1091}';
	private static readonly TEXT_BY_TYPE: Record<string, string> = {
		shipyard: '{20102,1071}',
		wharf: '{20102,1081}',
		equipmentdock: '{20102,1061}',
		defence: StationNamer.TEXT_DEFENCE,
	};

	private readonly types: StationTypes;

	constructor(private readonly tables: NamingTables) {
		this.types = new StationTypes((id) => tables.module(id));
	}

	type(station: SaveStation): StationTypeId {
		return this.types.of(station);
	}

	/** The name the game shows for a station (see "How the game names stations" in the design spec). */
	name(station: SaveStation): string {
		const tables = this.tables;
		if (station.name) {
			const resolved = GameTextRef.isRef(station.name) ? tables.text(station.name) : station.name;
			if (resolved) {
				return resolved;
			}
		}
		const ids = StationTypes.moduleIds(station);
		const infos = ids.map((id) => tables.module(id));
		if (station.owner !== 'player') {
			const base = this.npcBase(station, infos);
			const short = tables.factionShort(station.owner);
			return base ? [short, base].filter(Boolean).join(' ') : station.code;
		}
		if (station.basename) {
			const base = tables.text(station.basename);
			if (base) {
				return base;
			}
		}
		const sector = tables.sectorName(station.sector);
		const type = ids.length ? this.playerType(station, ids, infos) : tables.text(StationNamer.TEXT_FACTORY);
		if (!sector || !type) {
			return station.code;
		}
		const numeral = ids.length ? RomanNumeral.of(station.nameIndex ?? 0) : '';
		return [sector, type, numeral].filter(Boolean).join(' ');
	}

	/** Factory name of the highest-priority ware group among the products of the production modules. */
	private groupFactoryName(infos: ModuleInfos): string | undefined {
		let best: { factoryName: string; priority: number } | undefined;
		for (const info of infos) {
			if (info?.type !== ModuleTypes.production) {
				continue;
			}
			for (const ware of info.product) {
				const group = this.tables.wareGroup(ware);
				if (group && (!best || group.priority > best.priority)) {
					best = group;
				}
			}
		}
		return best?.factoryName;
	}

	private npcBase(station: SaveStation, infos: ModuleInfos): string | undefined {
		const tables = this.tables;
		return (
			(station.basename ? tables.text(station.basename) : undefined) ??
			(station.product ? tables.wareFactoryName(station.product) : undefined) ??
			this.groupFactoryName(infos) ??
			tables.macroName(station.macro) ??
			tables.text(StationNamer.TEXT_FACTORY)
		);
	}

	/** Type word of a player station, from its modules. */
	private playerType(station: SaveStation, ids: string[], infos: ModuleInfos): string | undefined {
		const tables = this.tables;
		const fixed = StationNamer.TEXT_BY_TYPE[this.type(station)];
		if (fixed) {
			return tables.text(fixed);
		}
		const scrap = ids.findIndex((id, i) => StationTypes.isProducing(infos[i]) && id.includes('scrap'));
		if (scrap >= 0) {
			const ware = infos[scrap]?.product[0];
			return (ware ? tables.wareFactoryName(ware) : undefined) ?? tables.text(StationNamer.TEXT_SCRAP);
		}
		return this.groupFactoryName(infos) ?? tables.text(StationNamer.TEXT_FACTORY);
	}
}
