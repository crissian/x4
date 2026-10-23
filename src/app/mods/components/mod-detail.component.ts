import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PriceRangePipe } from '../../core/format/price-range.pipe';
import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import { DetailComponent, DetailPageComponent } from '../../shared/components/detail-page.component';
import { EntityDetailPage } from '../../shared/components/entity-detail-page';
import { GAME_VERSIONS } from '../../shared/services/constants';
import { EquipmentModService } from '../../shared/services/equipment-mod.service';
import type { EquipmentMod } from '../../shared/services/model/equipment-mod';
import { ModColumns } from '../mod-columns';
import { ModSlots } from '../mod-slots';
import { IngredientListComponent } from './ingredient-list.component';
import { ModEffectListComponent } from './mod-effect-list.component';

/** An equipment mod: what it changes, what it goes on, what crafting it takes, and the mods like it. */
@Component({
	imports: [
		DataGridComponent,
		DetailComponent,
		DetailPageComponent,
		IngredientListComponent,
		ModEffectListComponent,
		PriceRangePipe,
		RouterLink,
	],
	templateUrl: './mod-detail.component.html',
})
export class ModDetailComponent extends EntityDetailPage<EquipmentMod> {
	protected readonly service = inject(EquipmentModService);

	protected readonly info = computed(() => {
		const mod = this.entity();
		return (
			mod && {
				slot: ModSlots.label(mod.slot),
				appliesTo: ModSlots.appliesTo(mod.slot),
				quality: this.service.quality(mod.quality),
				research: mod.research?.map((x) => this.service.research(x)).join(', '),
				version: mod.version ? GAME_VERSIONS[mod.version] : undefined,
			}
		);
	});

	/** The other mods with the same main stat, to compare. */
	protected readonly similar = computed(() => {
		const mod = this.entity();
		return mod
			? this.service
					.getEntities()
					.filter((x) => x.id !== mod.id && x.effect.stat === mod.effect.stat && !x.notForPlayer)
			: [];
	});
	protected readonly similarColumns = ModColumns.of(this.service, { slot: false });
	protected readonly statName = computed(() => {
		const mod = this.entity();
		return mod ? (this.service.stat(mod.effect.stat)?.name ?? mod.effect.stat) : '';
	});
}
