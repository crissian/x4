import { DestroyRef, Signal, effect, inject, untracked } from '@angular/core';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { skip } from 'rxjs';

/** Reads a page state from the URL query params and writes it back. */
export interface QueryParamCodec<T> {
	read(params: ParamMap): T;
	/** Every param of the state, null for a default (so a merge removes it). */
	write(state: T): Params;
}

/**
 * Keeps a page state in the URL query params of the current route: state changes replace the URL, and URL changes
 * the state didn't write itself (such as the header link clearing the params) are read back into the state.
 */
export class QueryParamSync<T> {
	private readonly router = inject(Router);
	private readonly route = inject(ActivatedRoute);
	/** The params last written to, or read from, the URL (none yet, so the first write cleans the URL). */
	private key = '';

	private constructor(
		private readonly state: Signal<T>,
		private readonly codec: QueryParamCodec<T>,
		private readonly apply: (state: T) => void
	) {
		effect(() => this.write(this.codec.write(this.state())));
		const subscription = this.route.queryParamMap.pipe(skip(1)).subscribe((params) => this.read(params));
		inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
	}

	/** Connects the state to the URL; `apply` sets the state read from the URL. Call in an injection context. */
	static connect<T>(state: Signal<T>, codec: QueryParamCodec<T>, apply: (state: T) => void): void {
		new QueryParamSync(state, codec, apply);
	}

	/** The row whose key the URL names, else the first row. */
	static pick<R>(rows: readonly R[], key: string, keyOf: (row: R) => string): R | undefined {
		return rows.find((x) => keyOf(x) === key) ?? rows[0];
	}

	private write(queryParams: Params): void {
		const key = JSON.stringify(queryParams);
		if (key === this.key) {
			return;
		}
		this.key = key;
		untracked(
			() =>
				void this.router.navigate([], {
					relativeTo: this.route,
					queryParams,
					queryParamsHandling: 'merge',
					replaceUrl: true,
				})
		);
	}

	private read(params: ParamMap): void {
		const state = this.codec.read(params);
		const key = JSON.stringify(this.codec.write(state));
		if (key !== this.key) {
			this.key = key;
			this.apply(state);
		}
	}
}
