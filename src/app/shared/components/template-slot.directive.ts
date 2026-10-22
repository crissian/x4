import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';

/**
 * Renders a template where it sits, with a context: `<ng-container [appTemplateSlot]="template" [context]="..." />`.
 * A small stand-in for `NgTemplateOutlet`, which would pull the common module code into the initial bundle.
 */
@Directive({ selector: '[appTemplateSlot]' })
export class TemplateSlotDirective<C> {
	readonly appTemplateSlot = input.required<TemplateRef<C>>();
	readonly context = input<C>();

	constructor() {
		const container = inject(ViewContainerRef);
		effect(() => {
			container.clear();
			container.createEmbeddedView(this.appTemplateSlot(), this.context());
		});
	}
}
