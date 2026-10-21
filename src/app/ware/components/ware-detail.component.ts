import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductionRequirementsComponent } from '../../shared/components/production-requirements.component';
import { ModuleService } from '../../shared/services/module.service';
import { formatProductionTime, toProductionData } from '../../shared/services/production';
import { ShipService } from '../../shared/services/ship.service';
import { WareService } from '../../shared/services/ware.service';

type WareTab = 'construction' | 'requiredFor';

@Component({
	imports: [DecimalPipe, RouterLink, ProductionRequirementsComponent],
	templateUrl: './ware-detail.component.html',
})
export class WareDetailComponent {
	private readonly wareService = inject(WareService);
	private readonly moduleService = inject(ModuleService);
	private readonly shipService = inject(ShipService);

	readonly id = input.required<string>();

	protected readonly tabs: { id: WareTab; label: string }[] = [
		{ id: 'construction', label: 'Construction' },
		{ id: 'requiredFor', label: 'Required For' },
	];
	protected readonly activeTab = signal<WareTab>('construction');

	protected readonly entity = computed(() => this.wareService.getEntity(this.id()));
	protected readonly production = computed(() => toProductionData(this.entity()?.production, this.wareService));
	protected readonly waresUsedIn = computed(() => this.wareService.getWaresUsingWare(this.id()));
	protected readonly modulesUsedIn = computed(() => this.moduleService.getModulesUsingWare(this.id()));
	protected readonly shipsUsedIn = computed(() => this.shipService.getEntitiesUsingWare(this.id()));

	protected readonly formatTime = formatProductionTime;
}
