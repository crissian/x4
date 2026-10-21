import { Component, computed, input, output } from '@angular/core';

const TYPES: Record<string, string> = {
	primary: 'border-sky-700 bg-sky-950/60 text-sky-200',
	secondary: 'border-neutral-600 bg-neutral-700/60 text-neutral-200',
	success: 'border-emerald-700 bg-emerald-950/60 text-emerald-200',
	danger: 'border-red-700 bg-red-950/60 text-red-200',
	warning: 'border-amber-700 bg-amber-950/60 text-amber-200',
	info: 'border-cyan-700 bg-cyan-950/60 text-cyan-200',
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
