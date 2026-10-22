import type { WareEconomy } from '../economy/economy-model';

/** A table row: the ware's economy with the names it shows. */
export interface SupplyDemandRow extends WareEconomy {
	name: string;
	/** ware group id */
	group: string;
}
