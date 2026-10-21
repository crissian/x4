import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { ComponentType } from '@angular/cdk/portal';

export type DialogSize = 'md' | 'lg';

const WIDTHS: Record<DialogSize, string> = { md: '32rem', lg: '50rem' };

/** Opens a component in a CDK dialog styled for the app. */
export function openDialog<R, D = unknown, C = unknown>(
	dialog: Dialog,
	component: ComponentType<C>,
	options: { data?: D; size?: DialogSize } = {}
): DialogRef<R, C> {
	return dialog.open<R, D, C>(component, {
		data: options.data,
		width: WIDTHS[options.size ?? 'md'],
		maxWidth: 'calc(100vw - 2rem)',
		panelClass: ['rounded-lg', 'border', 'border-line', 'bg-raised', 'text-fg', 'shadow-2xl'],
		backdropClass: ['cdk-overlay-dark-backdrop', 'backdrop-blur-[1px]'],
		autoFocus: 'first-tabbable',
	});
}
