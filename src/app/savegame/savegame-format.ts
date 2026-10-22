/** 900 -> '9.00' */
export function formatGameVersion(version: number): string {
	return (version / 100).toFixed(2);
}

/** In-game seconds as hours and minutes. */
export function formatGameTime(seconds: number): string {
	const total = Math.max(0, Math.floor(seconds / 60));
	const hours = Math.floor(total / 60);
	const minutes = total % 60;
	return $localize`${hours}:hours:h ${minutes}:minutes:m`;
}

let labels: Record<string, string> | undefined;

/** The DLC name of an extension id; unknown (mod) ids stay as they are. */
export function extensionLabel(id: string): string {
	labels ??= {
		ego_dlc_split: $localize`:DLC name:Split Vendetta`,
		ego_dlc_terran: $localize`:DLC name:Cradle of Humanity`,
		ego_dlc_pirate: $localize`:DLC name:Tides of Avarice`,
		ego_dlc_boron: $localize`:DLC name:Kingdom End`,
		ego_dlc_timelines: $localize`:DLC name:Timelines`,
		ego_dlc_mini_01: $localize`:DLC name:Hyperion Pack`,
		ego_dlc_mini_02: $localize`:DLC name:Envoy Pack`,
		ego_dlc_ventures: $localize`:DLC name:Ventures`,
	};
	return labels[id] ?? id;
}
