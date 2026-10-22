import { DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { LucideChevronsDown, LucideChevronsUp } from '@lucide/angular';
import { HQ_WORKFORCE, StationModuleModel, StationSettings } from '../station-calculator.model';
import { ExpandState } from './station-summary.shared';

interface WorkforceItem {
	amount: number;
	name: string;
	count: number;
}

/** Workforce needed and housed by the station, and the share of it at work. */
@Component({
	selector: 'app-station-workforce',
	imports: [DecimalPipe, FormField, LucideChevronsDown, LucideChevronsUp],
	templateUrl: './station-workforce.component.html',
})
export class StationWorkforceComponent {
	readonly modules = input.required<StationModuleModel[]>();
	readonly workforce = input.required<{ value: number; capacity: number }>();
	readonly settings = input.required<FieldTree<StationSettings>>();

	protected readonly expand = new ExpandState();
	private readonly values = computed(() => this.settings()().value());

	readonly hqWorkforce = HQ_WORKFORCE;
	readonly totalWorkforce = computed(() => this.workforce().value);
	readonly totalWorkforceCapacity = computed(() => this.workforce().capacity);

	readonly workforceNeeded = computed<WorkforceItem[]>(() =>
		this.modules().flatMap((x) => {
			const max = x.module?.workForce?.max;
			return x.module && max != null ? [{ amount: max, name: x.module.name, count: x.count }] : [];
		})
	);

	readonly workforceCapacity = computed<WorkforceItem[]>(() =>
		this.modules().flatMap((x) => {
			const capacity = x.module?.workForce?.capacity;
			return x.module && capacity != null ? [{ amount: capacity, name: x.module.name, count: x.count }] : [];
		})
	);

	readonly workforceStep = computed(() => {
		const capacity = this.totalWorkforceCapacity();
		return capacity === 0 ? 1 : capacity / 20;
	});

	readonly workforcePercent = computed(() => {
		const capacity = this.totalWorkforceCapacity();
		return capacity === 0 ? '0%' : Math.round((100 * this.values().partialWorkforce) / capacity) + '%';
	});
}
