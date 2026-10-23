import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WareService } from '../../services/ware.service';

/** A ware and how many of it. */
export interface WareAmountItem {
	ware: string;
	amount: number;
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

	protected readonly rows = computed(() => this.items().map((x) => ({ ...x, entity: this.wares.getEntity(x.ware) })));
}
