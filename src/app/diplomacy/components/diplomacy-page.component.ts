import { Component, computed, inject, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { QueryParamSync } from '../../core/router/query-param-sync';
import { ActiveSave } from '../../savegame/active-save';
import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import { OptionSelectComponent } from '../../shared/components/option-select.component';
import { RowNavigation } from '../../shared/components/row-navigation';
import { TabItem, TabsComponent } from '../../shared/components/tabs/tabs.component';
import { DiplomacyService } from '../../shared/services/diplomacy.service';
import { FactionService } from '../../shared/services/faction.service';
import type { DiplomacyAction } from '../../shared/services/model/diplomacy';
import { DiplomacyColumns, type DiplomacyGiftRow, type DiplomacyOptionRow } from '../diplomacy-columns';
import { type DiplomacyIds, type DiplomacyModel, DiplomacyQuery, type DiplomacyTab } from '../diplomacy-query';
import { DiplomacyWares } from '../diplomacy-wares';

/**
 * The diplomacy data of the game: the agent actions (filtered, the filters in the URL), the diplomatic events and the
 * options an agent can focus on, the gifts by faction and the agent experience levels and ranks. With a save, which
 * actions its diplomacy menu shows.
 */
@Component({
	imports: [DataGridComponent, FormField, OptionSelectComponent, RouterLink, TabsComponent],
	templateUrl: './diplomacy-page.component.html',
})
export class DiplomacyPageComponent {
	protected readonly service = inject(DiplomacyService);
	private readonly factions = inject(FactionService);
	private readonly wares = inject(DiplomacyWares);
	private readonly activeSave = inject(ActiveSave);
	protected readonly open = RowNavigation.inject<DiplomacyAction>();

	private readonly ids: DiplomacyIds = {
		categories: this.service.catalog.categories.map((x) => x.id),
		agentTypes: this.service.catalog.agentTypes.map((x) => x.id),
	};
	private readonly initial = DiplomacyQuery.read(inject(ActivatedRoute).snapshot.queryParamMap, this.ids);
	protected readonly tab = signal<DiplomacyTab>(this.initial.tab);
	protected readonly model = signal<DiplomacyModel>(this.initial.model);
	protected readonly form = form(this.model);

	protected readonly save = this.activeSave.save;
	protected readonly saveStatus = this.activeSave.statusOf(this.activeSave.diplomacy);
	protected readonly diplomacy = this.activeSave.diplomacy;
	protected readonly gameTime = this.activeSave.gameTime;

	protected readonly categories = this.service.catalog.categories;
	protected readonly agentTypes = this.service.catalog.agentTypes;

	protected readonly actions = computed(() =>
		DiplomacyQuery.apply(this.service.getEntities(), this.model(), this.diplomacy())
	);
	protected readonly actionColumns = computed(() => DiplomacyColumns.actions(this.service, this.diplomacy()));
	/** How many actions the menu of the save shows. */
	protected readonly shownCount = computed(
		() => Object.values(this.diplomacy()?.actions ?? {}).filter(Boolean).length
	);

	protected readonly options: DiplomacyOptionRow[] = this.service.catalog.events.flatMap((event) =>
		event.options.map((option) => ({ id: `${event.id}/${option.id}`, event, option }))
	);
	protected readonly optionColumns = DiplomacyColumns.options(this.service);

	protected readonly gifts: DiplomacyGiftRow[] = this.service.catalog.gifts.map((x) => ({
		id: x.ware,
		name: this.service.ware(x.ware),
		factions: x.factions
			.map((f) => this.factions.getEntity(f)?.name ?? f)
			.sort((a, b) => a.localeCompare(b))
			.join(', '),
		link: this.wares.link(x.ware),
	}));
	protected readonly giftColumns = DiplomacyColumns.gifts();

	protected readonly experienceColumns = DiplomacyColumns.experienceLevels();
	protected readonly rankColumns = DiplomacyColumns.ranks();

	protected readonly tabs: TabItem<DiplomacyTab>[] = [
		{ id: 'actions', label: $localize`:diplomacy tab:Agent actions`, count: this.service.getEntities().length },
		{ id: 'events', label: $localize`:diplomacy tab:Diplomatic events`, count: this.service.catalog.events.length },
		{ id: 'gifts', label: $localize`:diplomacy tab:Gifts`, count: this.gifts.length },
		{ id: 'agents', label: $localize`:diplomacy tab:Agents` },
	];

	constructor() {
		QueryParamSync.connect(
			computed(() => ({ tab: this.tab(), model: this.model() })),
			{ read: (params) => DiplomacyQuery.read(params, this.ids), write: (state) => DiplomacyQuery.write(state) },
			({ tab, model }) => {
				this.tab.set(tab);
				this.model.set(model);
			}
		);
	}
}
