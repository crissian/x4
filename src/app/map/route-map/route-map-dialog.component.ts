import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, forwardRef, inject } from '@angular/core';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { RouteMapComponent } from './route-map.component';

/** What the enlarged route map shows. */
export interface RouteMapDialogData {
	/** sector ids in travel order */
	path: readonly string[];
	/** sector ids outlined in red */
	warnSectors: readonly string[];
}

/** The route map enlarged in a dialog. */
@Component({
	selector: 'app-route-map-dialog',
	// the map opens this dialog, so the two files import each other
	imports: [ModalComponent, forwardRef(() => RouteMapComponent)],
	templateUrl: './route-map-dialog.component.html',
})
export class RouteMapDialogComponent {
	protected readonly data = inject<RouteMapDialogData>(DIALOG_DATA);
}
