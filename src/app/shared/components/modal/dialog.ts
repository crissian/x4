import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { ComponentType } from '@angular/cdk/portal';

export type DialogSize = 'md' | 'lg';

export class AppDialog {
	private static readonly WIDTHS: Record<DialogSize, string> = { md: '32rem', lg: '50rem' };

	/** Opens a component in a CDK dialog styled for the app. */
	static open<R, D = unknown, C = unknown>(
		dialog: Dialog,
		component: ComponentType<C>,
		options: { data?: D; size?: DialogSize } = {}
	): DialogRef<R, C> {
		return dialog.open<R, D, C>(component, {
			data: options.data,
			width: AppDialog.WIDTHS[options.size ?? 'md'],
			maxWidth: 'calc(100vw - 2rem)',
			panelClass: 'app-dialog-panel',
			backdropClass: ['cdk-overlay-dark-backdrop', 'app-dialog-backdrop'],
			autoFocus: 'first-tabbable',
		});
	}
}
