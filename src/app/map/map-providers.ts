import { Provider, inject } from '@angular/core';
import { MapGeometry } from './map-geometry';
import { MapStations } from './map-stations';
import { MapStore } from './map-store';
import { MapVaults } from './map-vaults';
import { MAP_SHAPES, MapSaveLayer } from './save/map-save-layer';
import { MapSaveSectors } from './save/map-save-sectors';

/**
 * Everything the map page provides. `MapSaveLayer` reads the shapes through `MAP_SHAPES` from
 * `MapGeometry`, not from `MapStore`, so `MapStore` can use the layer without an injection cycle.
 */
export const MAP_PROVIDERS: Provider[] = [
	MapGeometry,
	MapStore,
	MapStations,
	MapVaults,
	MapSaveLayer,
	MapSaveSectors,
	{ provide: MAP_SHAPES, useFactory: () => inject(MapGeometry).shapeById },
];
