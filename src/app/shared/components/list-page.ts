import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

export class RowNavigation {
	/** Returns a handler that navigates to the detail page of a clicked grid row. Needs an injection context. */
	static inject<T extends { id: string }>() {
		const router = inject(Router);
		const route = inject(ActivatedRoute);
		return (row: T) => router.navigate([row.id], { relativeTo: route });
	}
}
