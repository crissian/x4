import { Component, computed, input, output } from '@angular/core';

const TYPES: Record<string, string> = {
	primary: 'border-sky-300 bg-sky-50 text-sky-900 dark:border-sky-700 dark:bg-sky-950/60 dark:text-sky-200',
	secondary:
		'border-neutral-300 bg-neutral-100 text-neutral-800 dark:border-neutral-600 dark:bg-neutral-700/60 dark:text-neutral-200',
	success:
		'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200',
	danger: 'border-red-300 bg-red-50 text-red-900 dark:border-red-700 dark:bg-red-950/60 dark:text-red-200',
	warning:
		'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/60 dark:text-amber-200',
	info: 'border-cyan-300 bg-cyan-50 text-cyan-900 dark:border-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-200',
};

@Component({
	selector: 'app-alert',
	host: {
		role: 'alert',
		'[class]': 'classes()',
	},
	templateUrl: './alert.component.html',
})
export class AlertComponent {
	readonly type = input('info');
	readonly closed = output();

	protected readonly classes = computed(
		() => `mb-3 flex items-start gap-3 rounded-md border px-4 py-3 ${TYPES[this.type()] ?? TYPES['info']}`
	);
}
