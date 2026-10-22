import { DecimalPipe } from '@angular/common';
import { EnumLabelPipe } from '../../core/enum-labels';
import { Component, computed, inject, input } from '@angular/core';
import { DetailComponent, DetailPageComponent } from '../../shared/components/detail-page.component';
import { RouterLink } from '@angular/router';
import { ProductionCardComponent } from '../../shared/components/production-card.component';
import { SellersComponent } from '../../shared/components/sellers.component';
import { ModuleService } from '../../shared/services/module.service';
import { Production } from '../../shared/services/production';
import { WareService } from '../../shared/services/ware.service';

@Component({
	imports: [DetailPageComponent, DetailComponent, DecimalPipe, RouterLink, ProductionCardComponent, SellersComponent, EnumLabelPipe],
	templateUrl: './module-detail.component.html',
})
export class ModuleDetailComponent {
	private readonly service = inject(ModuleService);
	private readonly wareService = inject(WareService);

	readonly id = input.required<string>();

	protected readonly entity = computed(() => this.service.getEntity(this.id()));
	protected readonly production = computed(() => Production.toProductionData(this.entity()?.production, this.wareService));

	protected readonly getSlotsStr = Production.getSlotsStr;
}
