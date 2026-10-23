import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { FactionLabelComponent, FactionLabelFaction } from './faction-label.component';

@Component({
	imports: [FactionLabelComponent],
	template: `<app-faction-label [faction]="faction()" [link]="link()" [dot]="dot()">Unclaimed</app-faction-label>`,
})
class HostComponent {
	readonly faction = signal<FactionLabelFaction | undefined>({
		id: 'argon',
		name: 'Argon Federation',
		color: 'rgb(1, 2, 3)',
	});
	readonly link = signal(true);
	readonly dot = signal(true);
}

describe('FactionLabelComponent', () => {
	async function setup(change?: (host: HostComponent) => void) {
		TestBed.configureTestingModule({ providers: [provideRouter([])] });
		const fixture = TestBed.createComponent(HostComponent);
		change?.(fixture.componentInstance);
		await fixture.whenStable();
		return fixture.nativeElement as HTMLElement;
	}

	it('shows the colour dot and links the name to the faction page', async () => {
		const element = await setup();
		const dot = element.querySelector<HTMLElement>('app-color-dot');
		expect(dot?.style.background).toBe('rgb(1, 2, 3)');
		expect(dot?.getAttribute('data-size')).toBe('sm');
		const link = element.querySelector('a');
		expect(link?.getAttribute('href')).toBe('/factions/argon');
		expect(link?.textContent).toBe('Argon Federation');
	});

	it('leaves out the link and the dot when asked', async () => {
		const element = await setup((host) => {
			host.link.set(false);
			host.dot.set(false);
		});
		expect(element.querySelector('a')).toBeNull();
		expect(element.querySelector('app-color-dot')).toBeNull();
		expect(element.textContent?.trim()).toBe('Argon Federation');
	});

	it('shows the projected fallback without a faction', async () => {
		const element = await setup((host) => host.faction.set(undefined));
		expect(element.querySelector('a')).toBeNull();
		expect(element.textContent?.trim()).toBe('Unclaimed');
	});
});
