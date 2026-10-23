import { Routes } from '@angular/router';
import { BASE_TITLE } from '../shared/services/constants';
import { EntityTitle } from '../shared/services/entity-title';
import { CraftingItemService, EquipmentModService } from '../shared/services/equipment-mod.service';
import { CraftingItemDetailComponent } from './components/crafting-item-detail.component';
import { CraftingPageComponent } from './components/crafting-page.component';
import { ModDetailComponent } from './components/mod-detail.component';
import { ModsPageComponent } from './components/mods-page.component';

export default [
	{ path: '', component: ModsPageComponent, title: `${BASE_TITLE} - ${$localize`Equipment Mods`}` },
	{ path: 'crafting', component: CraftingPageComponent, title: `${BASE_TITLE} - ${$localize`Crafting`}` },
	{
		path: 'items/:id',
		component: CraftingItemDetailComponent,
		title: EntityTitle.of(CraftingItemService, $localize`Crafting`),
	},
	{
		path: ':id',
		component: ModDetailComponent,
		title: EntityTitle.of(EquipmentModService, $localize`Equipment Mods`),
	},
] satisfies Routes;
