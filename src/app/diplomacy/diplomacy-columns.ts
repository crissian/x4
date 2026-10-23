import { Duration } from '../core/format/duration';
import { NumberFormats } from '../core/format/number-formats';
import type { SaveDiplomacy } from '../savegame/extractors/diplomacy-extractor';
import type { GridColumn, GridDot } from '../shared/components/data-grid/grid-column';
import type { DiplomacyService } from '../shared/services/diplomacy.service';
import { Loadouts } from '../shared/services/loadout';
import type {
	DiplomacyAction,
	DiplomacyCost,
	DiplomacyEvent,
	DiplomacyEventOption,
	DiplomacyLevel,
} from '../shared/services/model/diplomacy';

/** A row of the diplomatic events list: one option of an event. */
export interface DiplomacyOptionRow {
	id: string;
	event: DiplomacyEvent;
	option: DiplomacyEventOption;
}

/** A row of the gifts list. */
export interface DiplomacyGiftRow {
	id: string;
	name: string;
	/** the faction names */
	factions: string;
	link?: readonly unknown[];
}

/** The data grid columns of the diplomacy lists. */
export class DiplomacyColumns {
	/** keeps a time on one line */
	private static readonly NO_BREAK = String.fromCharCode(0xa0);
	/** the dot of each risk, from none to very high */
	private static readonly RISK_DOTS: Record<string, GridDot> = {
		none: { tone: 'grey', level: 1 },
		low: { tone: 'green', level: 3 },
		medium: { tone: 'amber', level: 3 },
		high: { tone: 'orange', level: 3 },
		veryhigh: { tone: 'red', level: 3 },
	};

	/** The agent actions; with the diplomacy of a save, whether its menu shows each one. */
	static actions(service: DiplomacyService, save?: SaveDiplomacy): GridColumn<DiplomacyAction>[] {
		const columns: GridColumn<DiplomacyAction>[] = [
			{
				key: 'name',
				caption: $localize`Action`,
				link: (x) => ['/diplomacy', x.id],
				title: (x) => x.shortDescription,
				hideable: false,
			},
			{
				key: 'category',
				caption: $localize`Category`,
				lookup: service.catalog.categories.map((x) => ({ value: x.id, label: x.name })),
			},
			{
				key: 'agentType',
				caption: $localize`Agent experience`,
				lookup: service.catalog.agentTypes.map((x) => ({ value: x.id, label: x.name })),
			},
			{
				key: 'experience',
				caption: $localize`Recommended experience`,
				type: 'number',
				display: (x) => DiplomacyColumns.experience(service, x.experience),
				filterable: false,
			},
			DiplomacyColumns.risk(service, (x) => x.risk),
			{
				key: 'success.chance',
				caption: $localize`Success chance`,
				type: 'number',
				display: (x) => NumberFormats.percent(x.success.chance / 100),
			},
			...DiplomacyColumns.cost<DiplomacyAction>(service, (x) => x.cost),
			{
				key: 'reward.influence',
				caption: $localize`Influence gained`,
				type: 'number',
				value: (x) => x.reward.influence ?? 0,
				display: (x) => (x.reward.influence ? NumberFormats.whole(x.reward.influence) : ''),
			},
			DiplomacyColumns.time('duration', $localize`Duration`, (x) => x.duration),
			DiplomacyColumns.time('cooldown', $localize`Cooldown`, (x) => x.cooldown),
		];
		if (save?.found) {
			columns.push({
				key: 'shown',
				caption: $localize`In your save`,
				value: (x) => (save.actions[x.id] ? 'shown' : 'hidden'),
				lookup: [
					{ value: 'shown', label: $localize`:diplomacy action in the save:Available` },
					{ value: 'hidden', label: $localize`:diplomacy action in the save:Hidden` },
				],
				dot: (x) => (save.actions[x.id] ? { tone: 'green', level: 3 } : { tone: 'grey', level: 1 }),
			});
		}
		return columns;
	}

	/** The options of the diplomatic events. */
	static options(service: DiplomacyService): GridColumn<DiplomacyOptionRow>[] {
		return [
			{
				key: 'event',
				caption: $localize`Diplomatic event`,
				value: (x) => x.event.name,
				title: (x) => x.event.description,
				hideable: false,
			},
			{
				key: 'option',
				caption: $localize`Agent focus`,
				value: (x) => x.option.name,
				title: (x) => x.option.description,
				hideable: false,
			},
			DiplomacyColumns.risk(service, (x) => x.option.risk),
			...DiplomacyColumns.cost<DiplomacyOptionRow>(service, (x) => x.option.cost),
			{ key: 'weight', caption: $localize`Base weight`, type: 'number', value: (x) => x.option.weight },
			{
				key: 'relation',
				caption: $localize`Resulting reputation`,
				type: 'number',
				value: (x) => Loadouts.relationToReputation(x.option.relation),
				display: (x) => NumberFormats.signedWhole(Loadouts.relationToReputation(x.option.relation)),
				title: (x) => x.option.result.text,
			},
			DiplomacyColumns.time('duration', $localize`Event duration`, (x) => x.event.duration),
		];
	}

	/** The gift wares and the factions they are listed for. */
	static gifts(): GridColumn<DiplomacyGiftRow>[] {
		return [
			{ key: 'name', caption: $localize`Gift`, link: (x) => x.link, hideable: false },
			{ key: 'factions', caption: $localize`Factions` },
		];
	}

	/** The agent experience levels of each experience. */
	static experienceLevels(): GridColumn<DiplomacyLevel>[] {
		return [
			{ key: 'name', caption: $localize`Name` },
			{ key: 'value', caption: $localize`From experience`, type: 'number' },
		];
	}

	/** The agent ranks, reached by the negotiation and espionage experience together (md/diplomacy.xml). */
	static ranks(): GridColumn<DiplomacyLevel>[] {
		return [
			{ key: 'name', caption: $localize`Name` },
			{ key: 'value', caption: $localize`From negotiation + espionage experience`, type: 'number' },
			{
				key: 'eventBonus',
				caption: $localize`Event bonus`,
				type: 'number',
				format: { maximumFractionDigits: 2 },
			},
		];
	}

	/** The experience level name and value, e.g. "Novice (10)". */
	static experience(service: DiplomacyService, value: number | undefined): string {
		if (value == null) {
			return '';
		}
		const level = service.experienceLevel(value);
		return level ? `${level.name} (${NumberFormats.whole(value)})` : NumberFormats.whole(value);
	}

	/** The wares of a cost with their amounts, as text. */
	static wares(service: DiplomacyService, cost: DiplomacyCost): string {
		return cost.wares.map((x) => `${service.ware(x.ware)} ×${NumberFormats.whole(x.amount)}`).join(', ');
	}

	private static risk<T>(service: DiplomacyService, risk: (row: T) => string): GridColumn<T> {
		return {
			key: 'risk',
			caption: $localize`Risk to agent`,
			value: risk,
			sortValue: (x) => service.catalog.risks.findIndex((r) => r.id === risk(x)),
			lookup: service.catalog.risks.map((x) => ({ value: x.id, label: x.name })),
			title: (x) => service.risk(risk(x))?.description,
			dot: (x) => DiplomacyColumns.RISK_DOTS[risk(x)],
		};
	}

	private static cost<T>(service: DiplomacyService, cost: (row: T) => DiplomacyCost): GridColumn<T>[] {
		return [
			{ key: 'influence', caption: $localize`Influence cost`, type: 'number', value: (x) => cost(x).influence },
			{ key: 'money', caption: $localize`Money (Cr)`, type: 'number', value: (x) => cost(x).money },
			{
				key: 'wares',
				caption: $localize`Required items`,
				value: (x) => DiplomacyColumns.wares(service, cost(x)),
			},
		];
	}

	private static time<T>(key: string, caption: string, seconds: (row: T) => number): GridColumn<T> {
		return {
			key,
			caption,
			type: 'number',
			value: seconds,
			display: (x) => Duration.short(seconds(x)).replace(' ', DiplomacyColumns.NO_BREAK),
			filterable: false,
		};
	}
}
