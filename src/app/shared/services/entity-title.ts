import { Type, inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { BASE_TITLE } from './constants';
import { EntityService } from './entity.service';

/** Route title resolver showing the name of the entity identified by the `:id` route param. */
export function entityTitle(service: Type<EntityService<{ name: string }>>, section: string): ResolveFn<string> {
	return (route) => {
		const entity = inject(service).getEntity(route.paramMap.get('id'));
		return entity ? `${BASE_TITLE} - ${section} - ${entity.name}` : `${BASE_TITLE} - ${section}`;
	};
}
