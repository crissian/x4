import type { GridLookupItem } from '../components/data-grid/data-grid.component';

export const BASE_TITLE = 'X4: Foundations / Kingdom End';

/** Game content packs, indexed by the `version` of the generated entities. */
export const GAME_VERSIONS = [
	$localize`Base game`,
	'Split Vendetta',
	'Cradle of Humanity',
	'Tides of Avarice',
	'Kingdom End',
	'Timelines',
	'Hyperion Pack',
	'Envoy Pack',
];

/** Data grid filter values for a `version` column. */
export const GAME_VERSION_LOOKUP: GridLookupItem[] = GAME_VERSIONS.map((label, value) => ({ value, label }));

export const STATION_TYPES = [
	{ id: 'shipyard', label: $localize`Shipyard`, letter: 'S', color: '#f59e0b' },
	{ id: 'wharf', label: $localize`Wharf`, letter: 'W', color: '#22d3ee' },
	{ id: 'equipmentdock', label: $localize`Equipment dock`, letter: 'E', color: '#a3e635' },
	{ id: 'tradestation', label: $localize`Trading station`, letter: 'T', color: '#e879f9' },
	{ id: 'defence', label: $localize`Defence station`, letter: 'D', color: '#f87171' },
	{ id: 'piratebase', label: $localize`Pirate base`, letter: 'P', color: '#fb923c' },
	{ id: 'factory', label: $localize`Factory`, letter: 'F', color: '#94a3b8' },
	{ id: 'other', label: $localize`Other station`, letter: 'O', color: '#64748b' },
] as const;

export type StationTypeInfo = (typeof STATION_TYPES)[number];
export type StationTypeId = StationTypeInfo['id'];

/** Types of the game start stations; `factory` and `other` only exist for save stations. */
export const GAME_START_STATION_TYPES = STATION_TYPES.filter((x) => x.id !== 'factory' && x.id !== 'other');
