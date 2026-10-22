import { Routes } from '@angular/router';
import { BASE_TITLE } from '../shared/services/constants';
import { EntityTitle } from '../shared/services/entity-title';
import { ModuleService } from '../shared/services/module.service';
import { ModuleDetailComponent } from './components/module-detail.component';
import { ModulesComponent } from './components/modules.component';

export default [
	{ path: '', component: ModulesComponent, title: `${BASE_TITLE} - ${$localize`Modules`}` },
	{ path: ':id', component: ModuleDetailComponent, title: EntityTitle.of(ModuleService, $localize`Modules`) },
] satisfies Routes;
