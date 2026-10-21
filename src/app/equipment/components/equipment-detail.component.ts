import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EquipmentService } from '../../shared/services/equipment.service';

@Component({
	imports: [RouterLink],
	templateUrl: './equipment-detail.component.html',
})
export class EquipmentDetailComponent {
	private readonly service = inject(EquipmentService);

	readonly id = input.required<string>();
	protected readonly entity = computed(() => this.service.getEntity(this.id()));
}
