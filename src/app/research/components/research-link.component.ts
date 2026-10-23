import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToneDotComponent } from '../../shared/components/tone-dot/tone-dot.component';
import { ResearchLabels } from '../research-labels';
import type { ResearchData, ResearchState } from '../research-model';

/** A research project selecting itself on the research page (the `id` query param), after a dot of its state. */
@Component({
	selector: 'app-research-link',
	imports: [RouterLink, ToneDotComponent],
	templateUrl: './research-link.component.html',
})
export class ResearchLinkComponent {
	readonly project = input.required<ResearchData>();
	readonly state = input.required<ResearchState>();

	protected readonly tone = computed(() => ResearchLabels.TONES[this.state()]);
	protected readonly label = computed(() => ResearchLabels.state(this.state()));
}
