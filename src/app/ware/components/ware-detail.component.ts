import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { DetailComponent, DetailPageComponent } from '../../shared/components/detail-page.component';
import { RouterLink } from '@angular/router';
import { ProductionRequirementsComponent } from '../../shared/components/production-requirements.component';
import { ModuleService } from '../../shared/services/module.service';
import { formatProductionTime, toProductionData } from '../../shared/services/production';
import { ShipService } from '../../shared/services/ship.service';
import { WareService } from '../../shared/services/ware.service';
import { amountPerCycle } from '../../station/components/station-calculator.model';

type WareTab = 'construction' | 'producedBy' | 'requiredFor';

@Component({
	imports: [DetailPageComponent, DetailComponent, DecimalPipe, RouterLink, ProductionRequirementsComponent],
	templateUrl: './ware-detail.component.html',
})
export class WareDetailComponent {
	private readonly wareService = inject(WareService);
	private readonly moduleService = inject(ModuleService);
	private readonly shipService = inject(ShipService);

	readonly id = input.required<string>();

	protected readonly tabs: { id: WareTab; label: string }[] = [
		{ id: 'construction', label: 'Construction' },
		{ id: 'producedBy', label: 'Produced By' },
		{ id: 'requiredFor', label: 'Required For' },
	];
	protected readonly activeTab = signal<WareTab>('construction');

	protected readonly entity = computed(() => this.wareService.getEntity(this.id()));
	protected readonly production = computed(() => toProductionData(this.entity()?.production, this.wareService));
	protected readonly waresUsedIn = computed(() => this.wareService.getWaresUsingWare(this.id()));
	protected readonly producedBy = computed(() =>
		this.moduleService
			.getEntities()
			.filter((x) => [...(x.product ?? []), ...(x.processing ?? []).map((y) => y.ware)].some((y) => y.id === this.id()))
	);
	protected readonly modulesUsedIn = computed(() => this.moduleService.getModulesUsingWare(this.id()));
	protected readonly shipsUsedIn = computed(() => this.shipService.getEntitiesUsingWare(this.id()));

	protected readonly formatTime = formatProductionTime;
	protected readonly amountPerCycle = amountPerCycle;
}
