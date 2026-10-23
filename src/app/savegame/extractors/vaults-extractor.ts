import { MacroId } from '../../core/macro-id';
import { ElementStack } from '../../core/xml/element-stack';
import { XmlExtractor } from '../../core/xml/xml-extractor';
import { XmlAttributes } from '../../core/xml/xml-stream-scanner';

/** A data vault of the save: where it is and what the player did with it. */
export interface SaveVault {
	/** vault macro id, e.g. `landmarks_vault_01` */
	macro: string;
	sector: string;
	/** predefined zone id; x/z are then relative to that zone, else relative to the sector */
	zone?: string;
	/** km, rounded to 0.1 */
	x: number;
	y: number;
	z: number;
	/** the player has seen it */
	known: boolean;
	/** its signal leak was repaired (`<unlock state="unlocked">`) */
	unlocked: boolean;
	/** a crate it held was picked up (`<removed><connection macro="connection_pickup…">`) */
	looted: boolean;
}

export type SaveVaults = SaveVault[];

interface ZoneNode {
	kind: 'zone';
	macro: string;
	isDefault: boolean;
	x: number;
	z: number;
}
interface SectorNode {
	kind: 'sector';
	id: string;
}
interface VaultNode {
	kind: 'vault';
	vault: SaveVault;
	zone?: ZoneNode;
}
type VaultTreeNode = ZoneNode | SectorNode | VaultNode;

/** Reads the data vaults (`landmarks_…vault_NN` objects) with their position, discovery and unlock state. */
export class VaultsExtractor implements XmlExtractor<SaveVaults> {
	/** The key of the extracted data in the save's data. */
	static readonly KEY = 'vaults';
	private static readonly MACRO = /^landmarks_.*vault_\d+$/;
	readonly key = VaultsExtractor.KEY;
	private readonly vaults: VaultNode[] = [];
	private finished = false;
	private readonly stack = new ElementStack<VaultTreeNode>((name, _path, attrs) => this.select(name, attrs));

	open(name: string, path: readonly string[], attrs: () => XmlAttributes): void {
		switch (name) {
			case 'component':
				this.stack.open(name, path, attrs);
				break;
			case 'offset': {
				const owner = this.ancestor(path, 1);
				if (owner?.kind === 'zone' && attrs()['default'] === '1') {
					owner.isDefault = true;
				}
				break;
			}
			case 'position': {
				if (path[path.length - 2] !== 'offset') {
					break;
				}
				const owner = this.ancestor(path, 2);
				const a = owner && attrs();
				if (owner?.kind === 'zone') {
					owner.x = VaultsExtractor.num(a?.['x']);
					owner.z = VaultsExtractor.num(a?.['z']);
				} else if (owner?.kind === 'vault') {
					owner.vault.x = VaultsExtractor.num(a?.['x']);
					owner.vault.y = VaultsExtractor.num(a?.['y']);
					owner.vault.z = VaultsExtractor.num(a?.['z']);
				}
				break;
			}
			case 'unlock': {
				const owner = this.ancestor(path, 1);
				if (owner?.kind === 'vault' && attrs()['state'] === 'unlocked') {
					owner.vault.unlocked = true;
				}
				break;
			}
			case 'connection': {
				if (path[path.length - 2] !== 'removed') {
					break;
				}
				const owner = this.ancestor(path, 2);
				if (owner?.kind === 'vault' && attrs()['macro']?.startsWith('connection_pickup')) {
					owner.vault.looted = true;
				}
				break;
			}
		}
	}

	close(name: string, path: readonly string[]): void {
		if (name === 'component') {
			this.stack.close(name, path);
		} else if (path.length === 1) {
			this.finished = true;
		}
	}

	done(): boolean {
		return this.finished;
	}

	result(): SaveVaults {
		return this.vaults.map((node) => VaultsExtractor.finish(node));
	}

	private select(name: string, attrs: () => XmlAttributes): VaultTreeNode | undefined {
		if (name !== 'component') {
			return undefined;
		}
		const a = attrs();
		const cls = a['class'];
		if (cls === 'zone') {
			return { kind: 'zone', macro: a['macro'] ?? '', isDefault: false, x: 0, z: 0 };
		}
		if (cls === 'sector') {
			return { kind: 'sector', id: MacroId.of(a['macro'] ?? '') };
		}
		const macro = MacroId.of(a['macro'] ?? '');
		if (!VaultsExtractor.MACRO.test(macro)) {
			return undefined;
		}
		const sector = this.stack.nearest((n) => n.kind === 'sector')?.value as SectorNode | undefined;
		if (!sector) {
			return undefined;
		}
		const node: VaultNode = {
			kind: 'vault',
			vault: {
				macro,
				sector: sector.id,
				x: 0,
				y: 0,
				z: 0,
				known: a['knownto'] === 'player',
				unlocked: false,
				looted: false,
			},
			zone: this.stack.nearest((n) => n.kind === 'zone')?.value as ZoneNode | undefined,
		};
		this.vaults.push(node);
		return node;
	}

	/** the open component that is `up` levels above the current element */
	private ancestor(path: readonly string[], up: number): VaultTreeNode | undefined {
		return this.stack.nearest((_n, depth) => depth === path.length - up)?.value;
	}

	private static finish({ vault, zone }: VaultNode): SaveVault {
		const result = { ...vault };
		if (zone?.isDefault) {
			result.zone = MacroId.of(zone.macro);
		} else if (zone) {
			result.x += zone.x;
			result.z += zone.z;
		}
		result.x = VaultsExtractor.km(result.x);
		result.y = VaultsExtractor.km(result.y);
		result.z = VaultsExtractor.km(result.z);
		return result;
	}

	private static km(metres: number): number {
		return Math.round(metres / 100) / 10;
	}

	private static num(value: string | undefined): number {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : 0;
	}
}
