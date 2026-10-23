import type { ParamMap, Params } from '@angular/router';
import type { EquipmentMod, ModSlot } from '../shared/services/model/equipment-mod';
import { ModSlots } from './mod-slots';
import { QueryParams } from '../shared/services/query-params';

/** The filter form of the mods page; empty values match every mod. */
export interface ModsModel {
	/** a `ModSlot` */
	slot: string;
	/** '1', '2' or '3' */
	quality: string;
	/** a stat id the mod changes, as its main effect or one of its bonus effects */
	stat: string;
	/** part of a mod name */
	search: string;
	/** also the scenario mods the player can't craft */
	scenario: boolean;
}

/** Reads the mods page filters from the URL query params and writes them back, and applies them. */
export class ModQuery {
	static readonly DEFAULTS: Readonly<ModsModel> = { slot: '', quality: '', stat: '', search: '', scenario: false };
	private static readonly QUALITIES = ['1', '2', '3'];

	static read(params: ParamMap, statIds: readonly string[]): ModsModel {
		return {
			slot: QueryParams.oneOf<ModSlot | ''>(params, 'slot', ModSlots.ALL, ''),
			quality: QueryParams.oneOf(params, 'quality', ModQuery.QUALITIES, ''),
			stat: QueryParams.oneOf(params, 'stat', statIds, ''),
			search: params.get('q') ?? '',
			scenario: QueryParams.flag(params, 'scenario'),
		};
	}

	/** Every param, null for a default (so a merge removes it). */
	static write(model: ModsModel): Params {
		return {
			slot: model.slot || null,
			quality: model.quality || null,
			stat: model.stat || null,
			q: model.search.trim() || null,
			scenario: QueryParams.writeFlag(model.scenario),
		};
	}

	/** The mods the filters leave. */
	static apply(mods: readonly EquipmentMod[], model: ModsModel): EquipmentMod[] {
		const search = model.search.trim().toLowerCase();
		return mods.filter(
			(x) =>
				(model.scenario || !x.notForPlayer) &&
				(!model.slot || x.slot === model.slot) &&
				(!model.quality || x.quality === Number(model.quality)) &&
				(!model.stat || ModQuery.changes(x, model.stat)) &&
				(!search || x.name.toLowerCase().includes(search))
		);
	}

	/** The mod changes the stat, as its main effect or a bonus. */
	static changes(mod: EquipmentMod, stat: string): boolean {
		return mod.effect.stat === stat || (mod.bonus?.effects.some((x) => x.stat === stat) ?? false);
	}
}
