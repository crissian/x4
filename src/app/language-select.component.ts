import { Component, ElementRef, computed, input, model, viewChild } from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';
import { LucideCheck, LucideChevronDown } from '@lucide/angular';
import type { GameLanguage } from './core/game-text';

/** A language picker with flags, bound with [formField]. The list is a native popover, so outside clicks and Escape close it. */
@Component({
	selector: 'app-language-select',
	imports: [LucideCheck, LucideChevronDown],
	templateUrl: './language-select.component.html',
	host: { class: 'shrink-0' },
})
export class LanguageSelectComponent implements FormValueControl<string> {
	private static nextId = 0;

	readonly value = model('');
	readonly languages = input.required<readonly GameLanguage[]>();

	protected readonly panelId = `app-language-select-${LanguageSelectComponent.nextId++}`;
	protected readonly selected = computed(() => this.languages().find((x) => x.code === this.value()));

	private readonly button = viewChild.required<ElementRef<HTMLButtonElement>>('button');
	private readonly panel = viewChild.required<ElementRef<HTMLElement>>('panel');

	/** The popover lives in the top layer, so it is placed under the button, kept inside the viewport. */
	protected onBeforeToggle(event: Event) {
		if ((event as ToggleEvent).newState === 'open') {
			const rect = this.button().nativeElement.getBoundingClientRect();
			const style = this.panel().nativeElement.style;
			style.top = `${rect.bottom + 4}px`;
			style.right = `${Math.max(8, innerWidth - rect.right)}px`;
		}
	}

	/** Focus moves to the current language, so the arrow keys start from there. */
	protected onToggle(event: Event) {
		if ((event as ToggleEvent).newState === 'open') {
			this.options().find((x) => x.getAttribute('aria-current') === 'true')?.focus();
		}
	}

	protected choose(code: string) {
		this.panel().nativeElement.hidePopover();
		this.button().nativeElement.focus();
		this.value.set(code);
	}

	/** Up and Down move between the languages, wrapping around. */
	protected onArrow(event: Event, step: number) {
		event.preventDefault();
		const options = this.options();
		const index = options.indexOf(document.activeElement as HTMLButtonElement);
		options[(index + step + options.length) % options.length]?.focus();
	}

	private options() {
		return [...this.panel().nativeElement.querySelectorAll<HTMLButtonElement>('button')];
	}
}
