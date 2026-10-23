import { Descriptions } from '../../shared/services/descriptions';
import { DecimalPipe } from '@angular/common';
import { EnumLabelPipe } from '../../core/enum-labels';
import { Component, inject } from '@angular/core';
import { DetailComponent, DetailPageComponent } from '../../shared/components/detail-page.component';
import { RouterLink } from '@angular/router';
import { ProducibleDetailPage } from '../../shared/components/entity-detail-page';
import { EntityLinkComponent } from '../../shared/components/entity-link.component';
import { ProductionCardsComponent } from '../../shared/components/production-cards.component';
import { SellersComponent } from '../../shared/components/sellers.component';
import { StationModule } from '../../shared/services/model/model';
import { ModuleService } from '../../shared/services/module.service';
import { Production } from '../../shared/services/production';

@Component({
	imports: [
		DetailPageComponent,
		DetailComponent,
		DecimalPipe,
		RouterLink,
		EntityLinkComponent,
		ProductionCardsComponent,
		SellersComponent,
		EnumLabelPipe,
	],
	templateUrl: './module-detail.component.html',
})
export class ModuleDetailComponent extends ProducibleDetailPage<StationModule> {
	protected readonly service = inject(ModuleService);
	protected readonly description = Descriptions.of('modules', this.id);

	protected readonly getSlotsStr = Production.getSlotsStr;
}
