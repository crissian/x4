import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, TemplateRef, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { ConfirmComponent, ConfirmData } from './confirm.component';

interface Context {
	$implicit: string;
}

/** Supplies a message template the way a caller's .html does. */
@Component({ templateUrl: './confirm.component.spec.html' })
class HostComponent {
	readonly message = viewChild.required<TemplateRef<Context>>('message');
}

/** Text that HTML parsing would change. */
const NAME = 'x < y & z';

describe('ConfirmComponent', () => {
	function render(data: Partial<ConfirmData<Context>>): HTMLElement {
		TestBed.configureTestingModule({
			providers: [
				{ provide: DIALOG_DATA, useValue: data },
				{ provide: DialogRef, useValue: { close: () => undefined } },
			],
		});
		if (data.message === undefined) {
			const host = TestBed.createComponent(HostComponent);
			host.detectChanges();
			data.message = host.componentInstance.message();
		}
		const fixture = TestBed.createComponent(ConfirmComponent);
		fixture.detectChanges();
		return (fixture.nativeElement as HTMLElement).querySelector('p')!;
	}

	it('renders a message template from the caller with its context, without parsing HTML', () => {
		const paragraph = render({ title: 'Confirm', context: { $implicit: NAME } });
		expect(paragraph.querySelector('strong')?.textContent).toBe(NAME);
		expect(paragraph.textContent).toBe(`Delete ${NAME}?`);
	});

	it('shows a text message as plain text', () => {
		const paragraph = render({ title: 'Confirm', message: `Remove ${NAME}?` });
		expect(paragraph.textContent).toBe(`Remove ${NAME}?`);
		expect(paragraph.children.length).toBe(0);
	});
});
