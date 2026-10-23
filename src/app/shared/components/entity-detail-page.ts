import { Directive, computed, inject, input } from '@angular/core';
import { EntityService } from '../services/entity.service';
import { Production as ProductionModel } from '../services/model/model';
import { Production } from '../services/production';
import { WareService } from '../services/ware.service';

/**
 * Base of a page showing one entity: the `id` route parameter and the entity it names, looked up in `service`
 * (undefined for an unknown id).
 */
@Directive()
export abstract class EntityDetailPage<T> {
	/** The route parameter. */
	readonly id = input.required<string>();

	protected abstract readonly service: EntityService<T>;

	protected readonly entity = computed(() => this.service.getEntity(this.id()));
}

/** An entity detail page for something built from wares: also its production methods with the wares they take. */
@Directive()
export abstract class ProducibleDetailPage<T extends { production?: ProductionModel[] }> extends EntityDetailPage<T> {
	protected readonly wareService = inject(WareService);

	protected readonly production = computed(() =>
		Production.toProductionData(this.entity()?.production, this.wareService)
	);
}
