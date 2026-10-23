import { Component, inject } from '@angular/core';
import { DetailPageComponent } from '../../shared/components/detail-page.component';
import { EntityDetailPage } from '../../shared/components/entity-detail-page';
import { Race } from '../../shared/services/model/model';
import { RaceService } from '../../shared/services/race.service';

@Component({
	imports: [DetailPageComponent],
	templateUrl: './race-detail.component.html',
})
export class RaceDetailComponent extends EntityDetailPage<Race> {
	protected readonly service = inject(RaceService);
}
