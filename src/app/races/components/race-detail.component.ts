import { Component, computed, inject, input } from '@angular/core';
import { DetailPageComponent } from '../../shared/components/detail-page.component';
import { RaceService } from '../../shared/services/race.service';

@Component({
	imports: [DetailPageComponent],
	templateUrl: './race-detail.component.html',
})
export class RaceDetailComponent {
	private readonly service = inject(RaceService);

	readonly id = input.required<string>();
	protected readonly entity = computed(() => this.service.getEntity(this.id()));
}
