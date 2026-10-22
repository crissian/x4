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
	{ id: 'shipyard', label: $localize`Shipyard`, icon: 'anchor', color: '#f59e0b' },
	{ id: 'wharf', label: $localize`Wharf`, icon: 'ship', color: '#22d3ee' },
	{ id: 'equipmentdock', label: $localize`Equipment dock`, icon: 'wrench', color: '#a3e635' },
	{ id: 'tradestation', label: $localize`Trading station`, icon: 'arrow-left-right', color: '#e879f9' },
	{ id: 'defence', label: $localize`Defence station`, icon: 'shield', color: '#f87171' },
	{ id: 'piratebase', label: $localize`Pirate base`, icon: 'skull', color: '#fb923c' },
	{ id: 'factory', label: $localize`Factory`, icon: 'factory', color: '#94a3b8' },
	{ id: 'other', label: $localize`Other station`, icon: 'circle', color: '#64748b' },
] as const;

export type StationTypeInfo = (typeof STATION_TYPES)[number];
export type StationTypeId = StationTypeInfo['id'];

/** Types of the game start stations; `factory` and `other` only exist for save stations. */
export const GAME_START_STATION_TYPES = STATION_TYPES.filter((x) => x.id !== 'factory' && x.id !== 'other');
