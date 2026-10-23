/** Display texts of the order ids and fleet assignments a save gives the player's ships. */
export class ShipOrders {
	private static orders: Record<string, string> | undefined;
	private static assignments: Record<string, string> | undefined;

	/** The label of an order id; an unknown id is split into words (`MiningCollect` -> `Mining Collect`). */
	static label(order: string): string {
		ShipOrders.orders ??= ShipOrders.createOrders();
		return ShipOrders.orders[order] ?? ShipOrders.words(order);
	}

	/** The label of a fleet assignment such as `defence` or `supplyfleet`. */
	static assignment(value: string): string {
		ShipOrders.assignments ??= ShipOrders.createAssignments();
		return ShipOrders.assignments[value] ?? ShipOrders.words(value);
	}

	/** `TradeRoutine_Advanced` -> `Trade Routine Advanced` */
	static words(id: string): string {
		return id
			.replace(/_/g, ' ')
			.replace(/([a-z])([A-Z])/g, '$1 $2')
			.replace(/^./, (x) => x.toUpperCase());
	}

	// created on first use, after the translations are loaded
	private static createOrders(): Record<string, string> {
		return {
			Attack: $localize`:ship order:Attack`,
			CollectDropsInRadius: $localize`:ship order:Collect drops`,
			DeployToStation: $localize`:ship order:Deploy to station`,
			DockAndWait: $localize`:ship order:Dock and wait`,
			DockAt: $localize`:ship order:Dock`,
			Equip: $localize`:ship order:Equip`,
			Escort: $localize`:ship order:Escort`,
			Explore: $localize`:ship order:Explore`,
			MiningCollect: $localize`:ship order:Collect resources`,
			MiningPlayer: $localize`:ship order:Mine`,
			MiningRoutine: $localize`:ship order:Auto-mine`,
			MiningRoutine_Advanced: $localize`:ship order:Expert auto-mine`,
			MiningRoutine_Basic: $localize`:ship order:Basic auto-mine`,
			MoveGeneric: $localize`:ship order:Fly to`,
			MoveWait: $localize`:ship order:Fly and wait`,
			Patrol: $localize`:ship order:Patrol`,
			Police: $localize`:ship order:Police`,
			ProtectPosition: $localize`:ship order:Protect position`,
			ProtectShip: $localize`:ship order:Protect ship`,
			ProtectStation: $localize`:ship order:Protect station`,
			Repair: $localize`:ship order:Repair`,
			SalvageCollect: $localize`:ship order:Collect salvage`,
			SalvageCrush: $localize`:ship order:Crush salvage`,
			SalvageDeliver: $localize`:ship order:Deliver salvage`,
			SalvageRoutine: $localize`:ship order:Auto-salvage`,
			SingleBuy: $localize`:ship order:Buy`,
			SingleSell: $localize`:ship order:Sell`,
			SupplyFleet: $localize`:ship order:Supply fleet`,
			TradeExchangeNonShip: $localize`:ship order:Exchange wares`,
			TradePerform: $localize`:ship order:Trade`,
			TradeRoutine: $localize`:ship order:Auto-trade`,
			TradeRoutine_Advanced: $localize`:ship order:Expert auto-trade`,
			Undock: $localize`:ship order:Undock`,
			Wait: $localize`:ship order:Wait`,
			WaitForSignal: $localize`:ship order:Wait for signal`,
		};
	}

	private static createAssignments(): Record<string, string> {
		return {
			attack: $localize`:fleet assignment:Attack`,
			defence: $localize`:fleet assignment:Defence`,
			interception: $localize`:fleet assignment:Intercept`,
			mining: $localize`:fleet assignment:Mining`,
			positiondefence: $localize`:fleet assignment:Position defence`,
			salvage: $localize`:fleet assignment:Salvage`,
			supplyfleet: $localize`:fleet assignment:Supply fleet`,
			trade: $localize`:fleet assignment:Trade`,
		};
	}
}
