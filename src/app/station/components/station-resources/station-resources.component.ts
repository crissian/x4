import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { LucideChevronsDown, LucideChevronsUp } from '@lucide/angular';
import { WareService } from '../../../shared/services/ware.service';
import { StationResourceModel } from '../station-calculator.model';

/**
 * The Station Resources component
 */
@Component({
	selector: 'app-station-resources',
	imports: [DecimalPipe, LucideChevronsDown, LucideChevronsUp],
	templateUrl: './station-resources.component.html',
})
export class StationResourcesComponent {
	private readonly wareService = inject(WareService);

	readonly resources = input.required<StationResourceModel[]>();

	/** expanded state by ware id */
	readonly expanded = signal<Record<string, boolean>>({});

	readonly sortedResources = computed(() =>
		[...this.resources()].sort((a, b) => this.wareService.compareWares(a.ware, b.ware))
	);

	toggleExpanded(item: StationResourceModel) {
		this.expanded.update((state) => ({ ...state, [item.ware.id]: !state[item.ware.id] }));
	}
}
