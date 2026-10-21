import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/** Returns a handler that navigates to the detail page of a clicked grid row. */
export function injectRowNavigation<T extends { id: string }>() {
	const router = inject(Router);
	const route = inject(ActivatedRoute);
	return (row: T) => router.navigate([row.id], { relativeTo: route });
}
