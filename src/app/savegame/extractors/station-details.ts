import { MacroId } from '../../core/macro-id';
import { XmlAttributes } from '../../core/xml/xml-stream-scanner';
import { SaveOffer, SaveStation } from '../map/save-map-model';
import { SavePosition } from './save-position';

/** Collects the modules, own trade offers and workforce of one station while the map extractor streams it. */
export class StationDetails {
	private readonly modules = new Map<string, number>();
	private readonly offers: SaveOffer[] = [];
	private workforce: Record<string, number> | undefined;
	/** the shady offer whose `<restrictions>` may follow */
	private shady: SaveOffer | undefined;

	/** `id` is the station's component id, which its own offers name as buyer or seller. */
	constructor(private readonly id: string | undefined) {}

	/** `construction/sequence/entry@macro` */
	addModule(macro: string | undefined): void {
		if (macro) {
			const id = MacroId.of(macro);
			this.modules.set(id, (this.modules.get(id) ?? 0) + 1);
		}
	}

	/** `trade/offers/<group>/trade`; only offers with the station as buyer or seller and an amount count. */
	addOffer(a: XmlAttributes): void {
		this.shady = undefined;
		const sell = a['seller'] !== undefined && a['seller'] === this.id;
		const buy = a['buyer'] !== undefined && a['buyer'] === this.id;
		const amount = SavePosition.num(a['amount']);
		const ware = a['ware'];
		if (!ware || (!sell && !buy) || amount <= 0) {
			return;
		}
		const offer: SaveOffer = { ware, sell, price: Math.round(SavePosition.num(a['price'])) / 100, amount };
		this.offers.push(offer);
		if ((a['flags'] ?? '').split('|').includes('shady')) {
			this.shady = offer;
		}
	}

	/** `<restrictions>` inside an offer: a shady offer restricted to the player is for the player only */
	restrict(a: XmlAttributes): void {
		if (this.shady && (a['factions'] ?? '').split(' ').includes('player')) {
			this.shady.playerOnly = true;
		}
		this.shady = undefined;
	}

	/** `workforces/workforce` */
	addWorkforce(a: XmlAttributes): void {
		const race = a['race'];
		const amount = SavePosition.num(a['amount']);
		if (race && amount > 0) {
			(this.workforce ??= {})[race] = (this.workforce[race] ?? 0) + amount;
		}
	}

	applyTo(station: SaveStation): void {
		station.modules = [...this.modules.keys()];
		const counts = [...this.modules.values()];
		if (counts.some((x) => x > 1)) {
			station.moduleCounts = counts;
		}
		if (this.offers.length) {
			station.offers = this.offers;
		}
		if (this.workforce) {
			station.workforce = this.workforce;
		}
	}
}
