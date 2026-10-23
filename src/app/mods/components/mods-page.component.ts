import { Component, computed, inject, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { QueryParamSync } from '../../core/router/query-param-sync';
import { ListPageComponent } from '../../shared/components/list-page.component';
import { OptionSelectComponent } from '../../shared/components/option-select.component';
import { EquipmentModService } from '../../shared/services/equipment-mod.service';
import { ModColumns } from '../mod-columns';
import { type ModsModel, ModQuery } from '../mod-query';
import { ModSlots } from '../mod-slots';

/** Every equipment mod, filtered by slot, quality and the stat it changes, the filters kept in the URL. */
@Component({
	imports: [FormField, ListPageComponent, OptionSelectComponent, RouterLink],
	templateUrl: './mods-page.component.html',
})
export class ModsPageComponent {
	private readonly service = inject(EquipmentModService);
	private readonly statIds = this.service.stats.map((x) => x.id);

	protected readonly model = signal<ModsModel>(
		ModQuery.read(inject(ActivatedRoute).snapshot.queryParamMap, this.statIds)
	);
	protected readonly form = form(this.model);

	protected readonly slots = ModSlots.ALL.map((x) => ({ id: x, name: ModSlots.label(x) }));
	protected readonly qualities = this.service.qualities.map((x) => ({ id: String(x.id), name: x.name }));
	/** The stats of the chosen slot, or all of them; the chosen stat stays listed. */
	protected readonly stats = computed(() => {
		const { slot, stat } = this.model();
		return this.service.stats
			.filter((x) => !slot || x.slot === slot || x.id === stat)
			.map((x) => ({ id: x.id, name: x.name }));
	});

	protected readonly mods = computed(() => ModQuery.apply(this.service.getEntities(), this.model()));
	protected readonly columns = ModColumns.of(this.service, { pageFilters: true });

	constructor() {
		QueryParamSync.connect(
			this.model,
			{ read: (params) => ModQuery.read(params, this.statIds), write: (model) => ModQuery.write(model) },
			(model) => this.model.set(model)
		);
	}
}
