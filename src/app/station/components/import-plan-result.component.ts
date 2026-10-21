import { Component, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';
import { ImportResult } from './import-plans.component';

@Component({
	selector: 'app-import-result',
	templateUrl: './import-plan-result.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	standalone: false,
})
export class ImportPlanResultComponent {
	private _result: ImportResult;

	@Input()
	set result(value: ImportResult) {
		this._result = value;
	}

	get result() {
		return this._result;
	}

	@Output()
	selectPlan = new EventEmitter<string>();

	selectLayout(item: string) {
		this.selectPlan.emit(item);
	}
}
