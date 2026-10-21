import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RaceService } from '../../shared/services/race.service';

@Component({
	imports: [RouterLink],
	templateUrl: './race-detail.component.html',
})
export class RaceDetailComponent {
	private readonly service = inject(RaceService);

	readonly id = input.required<string>();
	protected readonly entity = computed(() => this.service.getEntity(this.id()));
}
