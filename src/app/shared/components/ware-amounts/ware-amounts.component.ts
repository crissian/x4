import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WareService } from '../../services/ware.service';

/** A ware and how many of it. */
export interface WareAmountItem {
	ware: string;
	amount: number;
}

/** The name of a ware and the page it links to, if any. */
export interface WareAmountTarget {
	name: string;
	link?: readonly unknown[];
}

/** A list of ware amounts, each ware linked to its page, the amounts aligned right. */
@Component({
	selector: 'app-ware-amounts',
	imports: [DecimalPipe, RouterLink],
	templateUrl: './ware-amounts.component.html',
})
export class WareAmountsComponent {
	private readonly wares = inject(WareService);

	readonly items = input.required<readonly WareAmountItem[]>();
	/** written after each amount, e.g. `/h` */
	readonly unit = input('');
	/** Names and links of wares without a ware page, such as inventory items; their ware page by default. */
	readonly resolve = input<(ware: string) => WareAmountTarget | undefined>();

	protected readonly rows = computed(() =>
		this.items().map((x) => ({ ...x, target: this.resolve()?.(x.ware) ?? this.target(x.ware) }))
	);

	private target(id: string): WareAmountTarget | undefined {
		const ware = this.wares.getEntity(id);
		return ware && { name: ware.name, link: ['/wares', ware.id] };
	}
}
