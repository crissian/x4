export class LegacyHashUrl {
	/**
	 * The app used hash URLs (`/#/ships/x?a=b`) before switching to path URLs (`/ships/x?a=b`).
	 * Returns the path URL an old hash link points to, relative to the base href, or null for any other URL.
	 */
	static toPath(hash: string): string | null {
		return hash.startsWith('#/') ? hash.slice(2) : null;
	}

	/** Rewrites an old hash link in the address bar to its path URL, before the router reads it. */
	static redirect() {
		const path = LegacyHashUrl.toPath(window.location.hash);
		if (path !== null) {
			window.history.replaceState(window.history.state, '', new URL(path, document.baseURI).href);
		}
	}
}
