import { Injectable, inject } from '@angular/core';
import { GameTextRef } from '../../core/game-text-ref';
import { MacroId } from '../../core/macro-id';
import type { NamingTables } from '../../savegame/map/station-name';
import type { StationModuleInfo } from '../../savegame/map/station-type';
import { GameTexts } from '../../shared/services/data/game-texts-data';
import { StationMacros } from '../../shared/services/data/station-macros-data';
import { FactionService } from '../../shared/services/faction.service';
import { ModuleService } from '../../shared/services/module.service';
import { SectorService } from '../../shared/services/universe.service';
import { WareService } from '../../shared/services/ware.service';

/**
 * The lookups the station naming rules need, backed by the site's data files (already in the selected
 * language). `MapSaveLayer` imports it dynamically once a save has map data, so the game text and station
 * macro files load in their own chunk, not with every map visit.
 */
@Injectable({ providedIn: 'root' })
export class SiteNamingTables implements NamingTables {
	private readonly factions = inject(FactionService);
	private readonly sectors = inject(SectorService);
	private readonly wares = inject(WareService);
	private readonly macros = new Map(StationMacros.all.map((x) => [x.id, x.name]));
	/** modules by save id: the macro lowercased without `_macro` */
	private readonly modules = new Map<string, StationModuleInfo>(
		inject(ModuleService)
			.getEntities()
			.map((x) => [
				MacroId.of(x.macro),
				{
					type: x.type,
					macro: x.macro,
					product: (x.product ?? x.processing?.map((p) => p.ware) ?? []).map((w) => w.id),
				},
			])
	);

	factionShort(owner: string): string | undefined {
		return this.factions.getEntity(owner)?.shortName;
	}

	sectorName(sector: string): string | undefined {
		return this.sectors.getEntity(sector)?.name;
	}

	text(ref: string): string | undefined {
		return GameTextRef.resolve(ref, GameTexts);
	}

	macroName(macro: string): string | undefined {
		return this.macros.get(MacroId.of(macro));
	}

	wareFactoryName(ware: string): string | undefined {
		return this.wares.getEntity(ware)?.factoryName;
	}

	wareGroup(ware: string): { factoryName: string; priority: number } | undefined {
		return this.wares.getEntity(ware)?.group;
	}

	module(id: string): StationModuleInfo | undefined {
		return this.modules.get(id);
	}
}
