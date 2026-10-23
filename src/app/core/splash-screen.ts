/** The loading splash of index.html: faded out and removed once the first page has loaded. */
export class SplashScreen {
	static hide(): void {
		const splash = document.getElementById('splash');
		if (!splash || splash.classList.contains('splash-hide')) return;
		splash.classList.add('splash-hide');
		setTimeout(() => splash.remove(), 400);
	}
}
