import { Pipe, PipeTransform } from '@angular/core';

export class EnumLabels {
	private static labels: Record<string, string> | undefined;

	/**
	 * The display text of a value of the hand written enums (ship types, sizes, module types...). The enum values stay
	 * English as they are compared and stored, only their display text is translated.
	 */
	static label(value: string): string {
		EnumLabels.labels ??= EnumLabels.create();
		return EnumLabels.labels[value] ?? value;
	}

	// keyed by the English enum value; created on first use, after the translations are loaded
	private static create(): Record<string, string> {
		return {
			// ShipType
			Resupplier: $localize`:ship type:Resupplier`,
			Miner: $localize`:ship type:Miner`,
			Carrier: $localize`:ship type:Carrier`,
			Fighter: $localize`:ship type:Fighter`,
			'Heavy Fighter': $localize`:ship type:Heavy Fighter`,
			Destroyer: $localize`:ship type:Destroyer`,
			'Large Miner': $localize`:ship type:Large Miner`,
			Freighter: $localize`:ship type:Freighter`,
			Bomber: $localize`:ship type:Bomber`,
			Scavenger: $localize`:ship type:Scavenger`,
			Frigate: $localize`:ship type:Frigate`,
			Transporter: $localize`:ship type:Transporter`,
			Interceptor: $localize`:ship type:Interceptor`,
			Scout: $localize`:ship type:Scout`,
			Courier: $localize`:ship type:Courier`,
			Builder: $localize`:ship type:Builder`,
			Corvette: $localize`:ship type:Corvette`,
			Police: $localize`:ship type:Police`,
			Battleship: $localize`:ship type:Battleship`,
			Gunboat: $localize`:ship type:Gunboat`,
			Tug: $localize`:ship type:Tug`,
			Compactor: $localize`:ship type:Compactor`,
			Envoy: $localize`:ship type:Envoy`,
			Expeditionary: $localize`:ship type:Expeditionary`,

			// ShipPurpose
			Auxiliary: $localize`:ship purpose:Auxiliary`,
			Mine: $localize`:ship purpose:Mine`,
			Build: $localize`:ship purpose:Build`,
			Fight: $localize`:ship purpose:Fight`,
			Trade: $localize`:ship purpose:Trade`,
			Salvage: $localize`:ship purpose:Salvage`,
			Dismantling: $localize`:ship purpose:Dismantling`,
			Racing: $localize`:ship purpose:Racing`,

			// Size
			'Extra Small': $localize`:size:Extra Small`,
			Small: $localize`:size:Small`,
			Medium: $localize`:size:Medium`,
			Large: $localize`:size:Large`,
			'Extra Large': $localize`:size:Extra Large`,

			// TransportType, CargoTypes
			Container: $localize`:cargo type:Container`,
			Liquid: $localize`:cargo type:Liquid`,
			Solid: $localize`:cargo type:Solid`,
			Condensate: $localize`:cargo type:Condensate`,

			// TurretType
			Standard: $localize`:turret type:Standard`,
			Missile: $localize`:turret type:Missile`,
			Mining: $localize`:turret type:Mining`,

			// EquipmentType
			Countermeasures: $localize`:equipment type:Countermeasures`,
			Drones: $localize`:equipment type:Drones`,
			Engines: $localize`:equipment type:Engines`,
			Missiles: $localize`:equipment type:Missiles`,
			Shields: $localize`:equipment type:Shields`,
			Software: $localize`:equipment type:Software`,
			Thrusters: $localize`:equipment type:Thrusters`,
			Turrets: $localize`:equipment type:Turrets`,
			Weapons: $localize`:equipment type:Weapons`,

			// EquipmentClass
			Countermeasure: $localize`:equipment class:Countermeasure`,
			Weapon: $localize`:equipment class:Weapon`,
			'Missile Turret': $localize`:equipment class:Missile Turret`,
			Turret: $localize`:equipment class:Turret`,
			Engine: $localize`:equipment class:Engine`,
			'Shield Generator': $localize`:equipment class:Shield Generator`,
			Scanner: $localize`:equipment class:Scanner`,
			'Missile Launcher': $localize`:equipment class:Missile Launcher`,
			'Small Drone': $localize`:equipment class:Small Drone`,
			'Extra Small Drone': $localize`:equipment class:Extra Small Drone`,

			// ModuleTypes
			'Connection Module': $localize`:module type:Connection Module`,
			Production: $localize`:module type:Production`,
			'Defense Module': $localize`:module type:Defense Module`,
			'Dock Area': $localize`:module type:Dock Area`,
			Habitation: $localize`:module type:Habitation`,
			Pier: $localize`:module type:Pier`,
			Storage: $localize`:module type:Storage`,
			'Build Module': $localize`:module type:Build Module`,
			'Venture Platform': $localize`:module type:Venture Platform`,
			Processing: $localize`:module type:Processing`,
			Recycling: $localize`:module type:Recycling`,
			Radar: $localize`:module type:Radar`,
			Welfare: $localize`:module type:Welfare`,

			// Logbook categories of a savegame, prefixed with log:
			'log:general': $localize`:logbook category:General`,
			'log:missions': $localize`:logbook category:Missions`,
			'log:news': $localize`:logbook category:News`,
			'log:alerts': $localize`:logbook category:Alerts`,
			'log:upkeep': $localize`:logbook category:Upkeep`,
			'log:tips': $localize`:logbook category:Tips`,
		};
	}
}

@Pipe({ name: 'enumLabel' })
export class EnumLabelPipe implements PipeTransform {
	transform(value: string | null | undefined): string {
		return value == null ? '' : EnumLabels.label(value);
	}
}
