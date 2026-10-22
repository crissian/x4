import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, forwardRef, inject } from '@angular/core';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { SectorService } from '../../shared/services/universe.service';
import { SectorMapComponent } from './sector-map.component';

/** The sector map enlarged in a dialog; the data is the sector id. */
@Component({
	selector: 'app-sector-map-dialog',
	// the map opens this dialog, so the two files import each other
	imports: [ModalComponent, forwardRef(() => SectorMapComponent)],
	templateUrl: './sector-map-dialog.component.html',
})
export class SectorMapDialogComponent {
	protected readonly sector = inject<string>(DIALOG_DATA);
	protected readonly name = inject(SectorService).getEntity(this.sector)?.name ?? this.sector;
}
