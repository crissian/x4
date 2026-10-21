import type { GridLookupItem } from '../components/data-grid/data-grid.component';

export const BASE_TITLE = 'X4: Foundations / Kingdom End';

/** Game content packs, indexed by the `version` of the generated entities. */
export const GAME_VERSIONS = [
	'Base game',
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
	{ id: 'shipyard', label: 'Shipyard', letter: 'S', color: '#f59e0b' },
	{ id: 'wharf', label: 'Wharf', letter: 'W', color: '#22d3ee' },
	{ id: 'equipmentdock', label: 'Equipment dock', letter: 'E', color: '#a3e635' },
	{ id: 'tradestation', label: 'Trading station', letter: 'T', color: '#e879f9' },
	{ id: 'defence', label: 'Defence station', letter: 'D', color: '#f87171' },
	{ id: 'piratebase', label: 'Pirate base', letter: 'P', color: '#fb923c' },
] as const;

export type StationTypeInfo = (typeof STATION_TYPES)[number];
