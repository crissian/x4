import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { FormField, form, max, min } from '@angular/forms/signals';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideCalculator } from '@lucide/angular';
import { QueryParamSync } from '../../core/router/query-param-sync';
import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import { OptionSelectComponent } from '../../shared/components/option-select.component';
import { ModuleService } from '../../shared/services/module.service';
import { WareService } from '../../shared/services/ware.service';
import { StationLayoutLink } from '../../station/station-layout-link';
import { ChainRecipes } from '../chain-recipes';
import { ChainDirection, ChainNode, ChainSettings, ProductionChain } from '../production-chain';
import { ProductionChainColumns } from '../production-chain-columns';
import { ProductionChainQuery } from '../production-chain-query';
import { ChainMethodPick, ProductionChainGraphComponent } from './production-chain-graph.component';

/** The form fields; the levels are a select, so a string. */
interface ChainForm {
	direction: string;
	method: string;
	modules: number;
	levels: string;
}

/**
 * The production chain of a ware with its settings (kept in the URL query params): the graph, a table of the wares
 * and a link opening the chain in the station calculator.
 */
@Component({
	selector: 'app-production-chain',
	imports: [
		DecimalPipe,
		FormField,
		RouterLink,
		LucideCalculator,
		OptionSelectComponent,
		DataGridComponent,
		ProductionChainGraphComponent,
	],
	templateUrl: './production-chain.component.html',
	host: { class: 'block' },
})
export class ProductionChainComponent {
	/** ware id */
	readonly ware = input.required<string>();

	private readonly wares = inject(WareService);
	private readonly chain = new ProductionChain(this.wares, new ChainRecipes(this.wares, inject(ModuleService)));

	protected readonly methods = ChainRecipes.methodOptions(this.wares.getEntities(), $localize`Universal`);
	protected readonly directions: { id: ChainDirection; name: string }[] = [
		{ id: 'inputs', name: $localize`Inputs (what it needs)` },
		{ id: 'usedBy', name: $localize`Used by (what it makes)` },
	];
	protected readonly levels = [
		{ id: '1', name: $localize`Direct only` },
		{ id: '2', name: $localize`2 levels` },
		{ id: '3', name: $localize`3 levels` },
		{ id: '0', name: $localize`All levels` },
	];
	private readonly query = new ProductionChainQuery((id) => this.methods.some((x) => x.id === id));

	private readonly initial = this.query.read(inject(ActivatedRoute).snapshot.queryParamMap);
	private readonly model = signal<ChainForm>(ProductionChainComponent.toForm(this.initial));
	protected readonly form = form(this.model, (x) => {
		min(x.modules, ProductionChainQuery.MODULES.min);
		max(x.modules, ProductionChainQuery.MODULES.max);
	});
	protected readonly overrides = signal<Record<string, string>>(this.initial.overrides);

	protected readonly settings = computed<ChainSettings>(() => {
		const model = this.model();
		return ProductionChainQuery.clean({
			direction: model.direction === 'usedBy' ? 'usedBy' : 'inputs',
			method: model.method,
			modules: model.modules,
			depth: Number(model.levels),
			overrides: this.overrides(),
		});
	});
	protected readonly graph = computed(() => this.chain.build(this.ware(), this.settings()));
	protected readonly usedBy = computed(() => this.settings().direction === 'usedBy');
	/** the made wares first, the raw resources last */
	protected readonly rows = computed(() => {
		const nodes = this.graph()?.nodes ?? [];
		return [...nodes.filter((x) => x.production), ...nodes.filter((x) => !x.production)];
	});
	protected readonly raw = computed(() => this.rows().filter((x) => !x.production));
	protected readonly columns = computed(() => ProductionChainColumns.all(this.usedBy()));
	protected readonly trackBy = (row: ChainNode) => row.ware.id;

	protected readonly calculator = StationLayoutLink.PATH;
	protected readonly calculatorParams = computed(() => {
		const graph = this.graph();
		return graph && !this.usedBy() ? StationLayoutLink.params(ProductionChain.calculatorRows(graph)) : undefined;
	});

	constructor() {
		QueryParamSync.connect(this.settings, this.query, (settings) => {
			this.model.set(ProductionChainComponent.toForm(settings));
			this.overrides.set(settings.overrides);
		});
	}

	protected pick({ ware, method }: ChainMethodPick): void {
		this.overrides.update((x) => ({ ...x, [ware]: method }));
	}

	protected resetMethods(): void {
		this.overrides.set({});
	}

	protected readonly hasOverrides = computed(() => Object.keys(this.overrides()).length > 0);

	private static toForm(settings: ChainSettings): ChainForm {
		return {
			direction: settings.direction,
			method: settings.method,
			modules: settings.modules,
			levels: String(settings.depth),
		};
	}
}
