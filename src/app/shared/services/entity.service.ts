export interface EntityService<T> {
	getEntity(id: string): T | undefined;
	getEntities(): readonly T[];
}

/** Read-only lookup over a list of generated entities, indexed by id. */
export abstract class EntityStore<T extends { id: string }> implements EntityService<T> {
	private readonly byId: ReadonlyMap<string, T>;

	protected constructor(private readonly entities: readonly T[]) {
		this.byId = new Map(entities.map((x) => [x.id, x]));
	}

	/** True when a production method of the item takes the ware as input. */
	static usesWare(
		item: { production?: readonly { wares: readonly { ware: string }[] }[] },
		wareId: string
	): boolean {
		return item.production?.some((p) => p.wares.some((w) => w.ware === wareId)) ?? false;
	}

	getEntities(): T[] {
		return this.entities as T[];
	}

	getEntity(id: string): T | undefined {
		return this.byId.get(id);
	}
}
