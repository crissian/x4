import { DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Duration } from '../../core/format/duration';
import { ResearchStore } from '../research-store';
import { ResearchLinkComponent } from './research-link.component';

/** The projects that can be started now, with their time and cost, cheapest first: what to research next. */
@Component({
	selector: 'app-research-next',
	imports: [DecimalPipe, ResearchLinkComponent],
	templateUrl: './research-next.component.html',
})
export class ResearchNextComponent {
	protected readonly store = inject(ResearchStore);

	protected readonly hasSave = computed(() => this.store.status() === 'ready');
	protected readonly items = computed(() =>
		this.store
			.next()
			.map((project) => ({
				project,
				time: Duration.short(project.time),
				value: this.store.value(project.wares),
				unlocks: project.unlocks.length,
			}))
			.sort((a, b) => a.value - b.value || a.project.sortOrder - b.project.sortOrder)
	);
}
