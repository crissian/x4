import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { HeatColors } from './heat-colors';
import { HeatMapComponent } from './heat-map.component';

const ARGON_PRIME = 'cluster_14_sector001';
const SECOND_CONTACT = 'cluster_13_sector001';
const TRUE_SIGHT = 'cluster_12_sector001';

describe('HeatColors', () => {
	it('has 9 distinct steps, ordered from red through grey to green', () => {
		const legend = HeatColors.legend();
		expect(legend.length).toBe(9);
		expect(new Set(legend).size).toBe(9);
		expect(legend[4]).toBe(HeatColors.fill(0, 100));
		expect(legend.slice(0, 4).every((x) => x.startsWith('hsl(0,'))).toBe(true);
		expect(legend.slice(5).every((x) => x.startsWith('hsl(140,'))).toBe(true);
	});

	it('shades symmetrically around zero', () => {
		for (const value of [1, 7, 120, 5000, 1e6]) {
			expect(HeatColors.step(-value, 1e6)).toBe(-HeatColors.step(value, 1e6));
		}
		expect(HeatColors.step(1e6, 1e6)).toBe(4);
		expect(HeatColors.step(-1e6, 1e6)).toBe(-4);
		expect(HeatColors.fill(-1e6, 1e6)).toBe(HeatColors.legend()[0]);
		expect(HeatColors.fill(1e6, 1e6)).toBe(HeatColors.legend()[8]);
	});

	it('keeps exactly zero grey, distinct from near zero', () => {
		expect(HeatColors.step(0, 1e6)).toBe(0);
		expect(HeatColors.fill(0, 1e6)).toBe(HeatColors.legend()[4]);
		expect(HeatColors.step(0.4, 1e6)).toBe(1);
		expect(HeatColors.fill(0.4, 1e6)).not.toBe(HeatColors.fill(0, 1e6));
	});

	it('maps the square root of the value onto the steps', () => {
		// share = sqrt(value / cap): the step edges are at 1/16, 4/16, 9/16 and 1 of the cap
		expect(HeatColors.step(0.01, 100)).toBe(1);
		expect(HeatColors.step(6, 100)).toBe(1);
		expect(HeatColors.step(7, 100)).toBe(2);
		expect(HeatColors.step(25, 100)).toBe(2);
		expect(HeatColors.step(26, 100)).toBe(3);
		expect(HeatColors.step(56, 100)).toBe(3);
		expect(HeatColors.step(57, 100)).toBe(4);
		expect(HeatColors.step(100, 100)).toBe(4);
		expect(HeatColors.step(-5000, 100)).toBe(-4);
		const steps = [-100, -50, -20, -5, 0, 5, 20, 50, 100].map((x) => HeatColors.step(x, 100));
		expect(steps).toEqual([...steps].sort((a, b) => a - b));
		expect(new Set(steps).size).toBe(9);
	});

	it('shows small values more than a linear scale would', () => {
		expect(HeatColors.step(10, 100)).toBe(2);
		expect(HeatColors.step(1, 100)).toBe(1);
	});

	it('has an idle grey different from the neutral one', () => {
		expect(HeatColors.IDLE).not.toBe(HeatColors.fill(0, 1));
		expect(HeatColors.legend()).not.toContain(HeatColors.IDLE);
	});

	it('caps the scale at the 95th percentile of the absolute values, 1 without values', () => {
		const values = Array.from({ length: 100 }, (_, i) => (i % 2 ? -(i + 1) : i + 1));
		values.push(1e9);
		expect(HeatColors.scale(values)).toBeLessThan(110);
		expect(HeatColors.scale(values)).toBeGreaterThan(90);
		expect(HeatColors.scale([3, -8, 5])).toBe(8);
		expect(HeatColors.scale([])).toBe(1);
		expect(HeatColors.scale([0])).toBe(1);
		// huge values above the cap clamp to the darkest step
		expect(HeatColors.step(1e9, HeatColors.scale(values))).toBe(4);
	});
});

describe('HeatMapComponent', () => {
	async function setup(values: Record<string, number>, centre?: string) {
		const fixture = TestBed.createComponent(HeatMapComponent);
		fixture.componentRef.setInput('values', new Map(Object.entries(values)));
		fixture.componentRef.setInput('lowLabel', 'Short');
		fixture.componentRef.setInput('highLabel', 'Surplus');
		fixture.componentRef.setInput('mapLabel', 'Map');
		if (centre) {
			fixture.componentRef.setInput('centre', centre);
		}
		await fixture.whenStable();
		fixture.detectChanges();
		const element = fixture.nativeElement as HTMLElement;
		const hex = (id: string) => element.querySelector<SVGPolygonElement>(`polygon[data-sector="${id}"]`)!;
		const clicks: string[] = [];
		fixture.componentInstance.sectorClick.subscribe((id) => clicks.push(id));
		return { fixture, element, hex, clicks };
	}

	it('fills the sectors red, grey and green by value', async () => {
		const { hex } = await setup({ [ARGON_PRIME]: -10, [SECOND_CONTACT]: 0, [TRUE_SIGHT]: 10 });
		expect(hex(ARGON_PRIME).getAttribute('fill')).toBe(HeatColors.legend()[0]);
		expect(hex(SECOND_CONTACT).getAttribute('fill')).toBe(HeatColors.legend()[4]);
		expect(hex(TRUE_SIGHT).getAttribute('fill')).toBe(HeatColors.legend()[8]);
	});

	it('paints idle sectors darker and a given scale sets the strongest colour', async () => {
		const { fixture, hex } = await setup({ [ARGON_PRIME]: 0.5, [SECOND_CONTACT]: 0.5 });
		fixture.componentRef.setInput('idle', new Set([SECOND_CONTACT]));
		fixture.componentRef.setInput('scale', 1);
		await fixture.whenStable();
		expect(hex(SECOND_CONTACT).getAttribute('fill')).toBe(HeatColors.IDLE);
		expect(hex(ARGON_PRIME).getAttribute('fill')).toBe(HeatColors.fill(0.5, 1));
		expect(hex(ARGON_PRIME).getAttribute('fill')).not.toBe(HeatColors.legend()[8]);
	});

	it('dims the sectors without a value and does not make them clickable', async () => {
		const { element, hex } = await setup({ [ARGON_PRIME]: 5 });
		expect(hex(SECOND_CONTACT)).toBeNull();
		expect(element.querySelectorAll('polygon[data-sector]').length).toBe(1);
		expect(element.querySelectorAll('polygon').length).toBeGreaterThan(10);
	});

	it('titles a sector with its name and value', async () => {
		const { hex } = await setup({ [ARGON_PRIME]: 5 });
		expect(hex(ARGON_PRIME).querySelector('title')!.textContent).toBe('Argon Prime: 5');
	});

	it('outlines the sectors of the area and dims the others', async () => {
		const { fixture, element, hex } = await setup(
			{ [ARGON_PRIME]: 5, [SECOND_CONTACT]: 5, [TRUE_SIGHT]: -5 },
			ARGON_PRIME
		);
		expect(element.querySelector('[data-area]')).toBeNull();
		expect(element.querySelector('[data-outside]')).toBeNull();
		fixture.componentRef.setInput('outline', new Set([ARGON_PRIME, SECOND_CONTACT]));
		await fixture.whenStable();
		expect(hex(ARGON_PRIME).hasAttribute('data-area')).toBe(true);
		expect(hex(SECOND_CONTACT).hasAttribute('data-area')).toBe(true);
		expect(hex(TRUE_SIGHT).hasAttribute('data-area')).toBe(false);
		expect(hex(TRUE_SIGHT).hasAttribute('data-outside')).toBe(true);
		expect(hex(TRUE_SIGHT).getAttribute('fill-opacity')).toBe('0.4');
		expect(hex(ARGON_PRIME).getAttribute('fill-opacity')).toBe('0.85');
		expect(hex(ARGON_PRIME).getAttribute('stroke')).not.toBe(hex(TRUE_SIGHT).getAttribute('stroke'));
		// the shading stays
		expect(hex(TRUE_SIGHT).getAttribute('fill')).toBe(HeatColors.fill(-5, fixture.componentInstance.max()));
		// the centre has its own, stronger outline
		expect(element.querySelector('[data-centre]')!.getAttribute('stroke-width')).toBe('3');
	});

	it('outlines the centre', async () => {
		const { element } = await setup({ [ARGON_PRIME]: 5 }, ARGON_PRIME);
		expect(element.querySelector('[data-centre]')!.getAttribute('data-centre')).toBe(ARGON_PRIME);
		const none = await setup({ [ARGON_PRIME]: 5 });
		expect(none.element.querySelector('[data-centre]')).toBeNull();
	});

	it('picks a sector on a click, not after a drag', async () => {
		const { element, hex, clicks } = await setup({ [ARGON_PRIME]: 5, [SECOND_CONTACT]: -5 });
		const area = element.querySelector<HTMLElement>('[role="region"]')!;
		const fire = (type: string, target: Element, x: number) =>
			target.dispatchEvent(new MouseEvent(type, { bubbles: true, button: 0, clientX: x, clientY: 0 }));
		fire('pointerdown', hex(ARGON_PRIME), 10);
		fire('pointerup', hex(ARGON_PRIME), 10);
		expect(clicks).toEqual([ARGON_PRIME]);
		fire('pointerdown', hex(SECOND_CONTACT), 10);
		fire('pointermove', area, 80);
		fire('pointerup', hex(SECOND_CONTACT), 80);
		expect(clicks).toEqual([ARGON_PRIME]);
	});

	it('picks a sector with Enter', async () => {
		const { hex, clicks } = await setup({ [ARGON_PRIME]: 5 });
		hex(ARGON_PRIME).dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
		expect(clicks).toEqual([ARGON_PRIME]);
		expect(hex(ARGON_PRIME).getAttribute('tabindex')).toBe('0');
	});

	it('shows the legend with its labels', async () => {
		const { element } = await setup({ [ARGON_PRIME]: 5 });
		const legend = element.querySelector('[data-legend]')!;
		expect(legend.textContent).toContain('Short');
		expect(legend.textContent).toContain('Surplus');
		expect(legend.querySelectorAll('span.flex-1').length).toBe(9);
		expect(legend.querySelector('[data-ticks]')).toBeNull();
	});
});
