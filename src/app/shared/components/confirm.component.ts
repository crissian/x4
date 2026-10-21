import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	templateUrl: './confirm.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	standalone: false,
})
export class ConfirmComponent {
	constructor(public activeModal: NgbActiveModal) {}

	@Input()
	title: string;

	@Input()
	message: string;
}
