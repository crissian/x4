import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EntityImageComponent } from '../../shared/components/entity-image.component';
import { ProductionCardComponent } from '../../shared/components/production-card.component';
import { ModuleService } from '../../shared/services/module.service';
import { getSlotsStr, toProductionData } from '../../shared/services/production';
import { WareService } from '../../shared/services/ware.service';

@Component({
	imports: [DecimalPipe, RouterLink, ProductionCardComponent, EntityImageComponent],
	templateUrl: './module-detail.component.html',
})
export class ModuleDetailComponent {
	private readonly service = inject(ModuleService);
	private readonly wareService = inject(WareService);

	readonly id = input.required<string>();

	protected readonly entity = computed(() => this.service.getEntity(this.id()));
	protected readonly production = computed(() => toProductionData(this.entity()?.production, this.wareService));

	protected readonly getSlotsStr = getSlotsStr;
}
