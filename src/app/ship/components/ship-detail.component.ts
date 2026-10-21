import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EntityImageComponent } from '../../shared/components/entity-image.component';
import { ProductionCardComponent } from '../../shared/components/production-card.component';
import { getSlotsStr, toProductionData } from '../../shared/services/production';
import { ShipService } from '../../shared/services/ship.service';
import { WareService } from '../../shared/services/ware.service';

@Component({
	imports: [DecimalPipe, RouterLink, ProductionCardComponent, EntityImageComponent],
	templateUrl: './ship-detail.component.html',
})
export class ShipDetailComponent {
	private readonly service = inject(ShipService);
	private readonly wareService = inject(WareService);

	readonly id = input.required<string>();

	protected readonly entity = computed(() => this.service.getEntity(this.id()));
	protected readonly production = computed(() => toProductionData(this.entity()?.production, this.wareService));
	protected readonly mainShields = computed(() => this.entity()?.shields?.filter((x) => !x.group) ?? []);
	protected readonly additionalShields = computed(() => this.entity()?.shields?.filter((x) => x.group) ?? []);

	protected readonly getSlotsStr = getSlotsStr;
}
