import { Routes } from '@angular/router';
import { BASE_TITLE } from '../shared/services/constants';
import { EntityTitle } from '../shared/services/entity-title';
import { WareService } from '../shared/services/ware.service';
import { ProductionChainPageComponent } from './components/production-chain-page.component';

export default [
	{
		path: '',
		component: ProductionChainPageComponent,
		title: `${BASE_TITLE} - ${$localize`Production Chains`}`,
	},
	{
		path: ':id',
		component: ProductionChainPageComponent,
		title: EntityTitle.of(WareService, $localize`Production Chains`),
	},
] satisfies Routes;
