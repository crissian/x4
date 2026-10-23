import { Component, computed, inject } from '@angular/core';
import { PriceRangePipe } from '../../core/format/price-range.pipe';
import { DetailComponent, DetailPageComponent } from '../../shared/components/detail-page.component';
import { EntityDetailPage } from '../../shared/components/entity-detail-page';
import { FactionLabelComponent } from '../../shared/components/faction-label.component';
import { Descriptions } from '../../shared/services/descriptions';
import { CraftingItemService, EquipmentModService } from '../../shared/services/equipment-mod.service';
import { FactionService } from '../../shared/services/faction.service';
import type { CraftingItem } from '../../shared/services/model/equipment-mod';
import { CraftingService } from '../crafting-index';
import { CraftingTags } from '../crafting-tags';
import { IngredientListComponent } from './ingredient-list.component';
import { RecipeUsesComponent } from './recipe-uses.component';

/** A crafting item: where to find it, its own recipe, and what it crafts into. */
@Component({
	selector: 'app-crafting-item-detail',
	imports: [
		DetailComponent,
		DetailPageComponent,
		FactionLabelComponent,
		IngredientListComponent,
		PriceRangePipe,
		RecipeUsesComponent,
	],
	templateUrl: './crafting-item-detail.component.html',
})
export class CraftingItemDetailComponent extends EntityDetailPage<CraftingItem> {
	protected readonly service = inject(CraftingItemService);
	protected readonly description = Descriptions.of('crafting', this.id);
	private readonly mods = inject(EquipmentModService);
	private readonly factions = inject(FactionService);
	private readonly crafting = inject(CraftingService);

	protected readonly info = computed(() => {
		const item = this.entity();
		return (
			item && {
				kind: CraftingTags.label(item),
				sources: (item.sources ?? []).map((x) => this.mods.source(x)).join(', '),
				illegal: (item.illegal ?? []).map((x) => this.factions.getEntity(x)).filter((x) => !!x),
				recipe: this.crafting.recipe(item.id),
			}
		);
	});
}
