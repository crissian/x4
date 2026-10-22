import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { FileDropComponent } from './file-drop.component';

@Component({
	imports: [FileDropComponent],
	template: `<app-file-drop [disabled]="disabled()" (files)="received.push($event)">Drop here</app-file-drop>`,
})
class HostComponent {
	readonly disabled = signal(false);
	readonly received: File[][] = [];
}

function setup() {
	const fixture = TestBed.createComponent(HostComponent);
	fixture.detectChanges();
	const zone = fixture.nativeElement.querySelector('app-file-drop') as HTMLElement;
	return { fixture, zone };
}

function drop(zone: HTMLElement, files: File[]) {
	const event = new Event('drop', { bubbles: true, cancelable: true });
	Object.defineProperty(event, 'dataTransfer', { value: { files } });
	zone.dispatchEvent(event);
}

describe('FileDropComponent', () => {
	it('emits dropped files', () => {
		const { fixture, zone } = setup();
		const file = new File(['x'], 'save.xml');
		drop(zone, [file]);
		expect(fixture.componentInstance.received).toEqual([[file]]);
	});

	it('emits nothing when disabled', () => {
		const { fixture, zone } = setup();
		fixture.componentInstance.disabled.set(true);
		fixture.detectChanges();
		drop(zone, [new File(['x'], 'save.xml')]);
		expect(fixture.componentInstance.received).toEqual([]);
	});

	it('cancels dragover while disabled, so a dropped file does not open in the tab', () => {
		const { fixture, zone } = setup();
		fixture.componentInstance.disabled.set(true);
		fixture.detectChanges();
		const event = new Event('dragover', { bubbles: true, cancelable: true });
		Object.defineProperty(event, 'dataTransfer', { value: { dropEffect: 'copy' } });
		zone.dispatchEvent(event);
		expect(event.defaultPrevented).toBe(true);
		expect((event as DragEvent).dataTransfer!.dropEffect).toBe('none');
	});
	it('applies the state classes to the drop box', () => {
		const { fixture, zone } = setup();
		const box = zone.querySelector('div') as HTMLElement;
		expect(box.classList).toContain('cursor-pointer');
		expect(box.classList).toContain('border-dashed');
		fixture.componentInstance.disabled.set(true);
		fixture.detectChanges();
		expect(box.classList).toContain('opacity-50');
		expect(box.classList).not.toContain('cursor-pointer');
	});
});
