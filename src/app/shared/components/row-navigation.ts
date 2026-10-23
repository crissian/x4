import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/** Click handlers of grid rows that open a detail page. */
export class RowNavigation {
	/** Returns a handler that navigates to the detail page of a clicked grid row. Needs an injection context. */
	static inject<T extends { id: string }>() {
		const router = inject(Router);
		const route = inject(ActivatedRoute);
		return (row: T) => router.navigate([row.id], { relativeTo: route });
	}

	/**
	 * Returns a handler that opens the page under `base` (such as `/ships`) of the entity a clicked grid row names.
	 * Needs an injection context.
	 */
	static to<T>(base: string, idOf: (row: T) => string) {
		const router = inject(Router);
		return (row: T) => router.navigate([base, idOf(row)]);
	}
}
