import { Component, computed, input } from '@angular/core';

@Component({
	selector: 'app-progress-bar',
	host: {
		role: 'progressbar',
		class: 'block',
		'[attr.aria-valuemin]': '0',
		'[attr.aria-valuemax]': 'max()',
		'[attr.aria-valuenow]': 'value()',
		'[attr.aria-label]': 'label() || null',
	},
	template: `
		<div class="h-2 overflow-hidden rounded-full bg-surface-2">
			<div class="h-full rounded-full bg-sky-600 transition-[width] dark:bg-sky-400" [style.width.%]="percent()"></div>
		</div>
	`,
})
export class ProgressBarComponent {
	readonly value = input.required<number>();
	readonly max = input.required<number>();
	readonly label = input<string>('');

	protected readonly percent = computed(() => (this.max() > 0 ? Math.min(100, Math.max(0, (this.value() / this.max()) * 100)) : 0));
}
