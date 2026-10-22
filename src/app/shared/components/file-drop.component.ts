import { Component, ElementRef, input, output, signal, viewChild } from '@angular/core';

/** Drop zone that also opens the file picker on click. The projected content is the label. */
@Component({
	selector: 'app-file-drop',
	host: {
		role: 'button',
		'[attr.tabindex]': 'disabled() ? -1 : 0',
		'[attr.aria-disabled]': 'disabled()',
		'[class]': 'classes()',
		'(click)': 'open()',
		'(keydown.enter)': 'open()',
		'(keydown.space)': 'open(); $event.preventDefault()',
		'(dragover)': 'dragOver($event)',
		'(dragleave)': 'over.set(false)',
		'(drop)': 'drop($event)',
	},
	template: `
		<ng-content />
		<input #picker type="file" class="hidden" tabindex="-1" [attr.accept]="accept() || null" [multiple]="multiple()" (change)="picked()" />
	`,
})
export class FileDropComponent {
	/** the `accept` attribute of the file picker, e.g. `.gz,.xml` */
	readonly accept = input<string>('');
	readonly disabled = input(false);
	/** let the picker select several files */
	readonly multiple = input(false);
	readonly files = output<File[]>();

	protected readonly over = signal(false);
	private readonly picker = viewChild.required<ElementRef<HTMLInputElement>>('picker');

	protected classes(): string {
		const base =
			'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ';
		if (this.disabled()) {
			return base + 'cursor-not-allowed border-line opacity-50';
		}
		return (
			base +
			(this.over()
				? 'cursor-pointer border-sky-500 bg-sky-50 dark:bg-sky-950/40'
				: 'cursor-pointer border-line-strong hover:border-sky-500 hover:bg-hover')
		);
	}

	protected open() {
		if (!this.disabled()) {
			this.picker().nativeElement.click();
		}
	}

	protected dragOver(event: DragEvent) {
		// always cancel, or the browser opens a file dropped while disabled and leaves the page
		event.preventDefault();
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = this.disabled() ? 'none' : 'copy';
		}
		this.over.set(!this.disabled());
	}

	protected drop(event: DragEvent) {
		event.preventDefault();
		this.over.set(false);
		this.emit(event.dataTransfer?.files);
	}

	protected picked() {
		const input = this.picker().nativeElement;
		this.emit(input.files);
		input.value = ''; // picking the same file again must fire again
	}

	private emit(list: FileList | File[] | null | undefined) {
		const files = Array.from(list ?? []);
		if (!this.disabled() && files.length > 0) {
			this.files.emit(files);
		}
	}
}
