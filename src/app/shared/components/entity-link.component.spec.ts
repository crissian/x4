import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { EntityLinkComponent } from './entity-link.component';

@Component({
	imports: [EntityLinkComponent],
	template: `<app-entity-link route="/races" [entity]="entity()" />`,
})
class HostComponent {
	readonly entity = signal<{ id: string; name: string } | undefined>({ id: 'argon', name: 'Argon' });
}

describe('EntityLinkComponent', () => {
	async function setup(entity?: { id: string; name: string }) {
		TestBed.configureTestingModule({ providers: [provideRouter([])] });
		const fixture = TestBed.createComponent(HostComponent);
		fixture.componentInstance.entity.set(entity);
		await fixture.whenStable();
		return fixture.nativeElement as HTMLElement;
	}

	it('links to the entity page under the route', async () => {
		const link = (await setup({ id: 'argon', name: 'Argon' })).querySelector('a');
		expect(link?.getAttribute('href')).toBe('/races/argon');
		expect(link?.textContent).toBe('Argon');
	});

	it('shows a dash without an entity', async () => {
		const element = await setup(undefined);
		expect(element.querySelector('a')).toBeNull();
		expect(element.textContent?.trim()).toBe('-');
	});
});
