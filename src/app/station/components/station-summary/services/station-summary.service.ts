import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * The Station Summary service
 */
@Injectable({
	providedIn: 'root',
})
export class StationSummaryService {
	/**
	 * number of partial workforce subject
	 */
	partialWorkforceChanged: Subject<number> = new Subject<number>();
	/**
	 * number of partial workforce
	 */
	private partialWorkforce: number = 0;

	/**
	 * The constructor
	 */
	constructor() {}

	/**
	 * set partial workforce
	 */
	setPartialWorkforce(partialWorkforce: number) {
		this.partialWorkforce = partialWorkforce;
		this.partialWorkforceChanged.next(this.partialWorkforce);
	}
	/**
	 * get number of partial workforce
	 * @return {number}
	 */
	public get $partialWorkforce(): number {
		return this.partialWorkforce;
	}
}
