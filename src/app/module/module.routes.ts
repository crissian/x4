import { Routes } from '@angular/router';
import { BASE_TITLE } from '../shared/services/constants';
import { entityTitle } from '../shared/services/entity-title';
import { ModuleService } from '../shared/services/module.service';
import { ModuleDetailComponent } from './components/module-detail.component';
import { ModulesComponent } from './components/modules.component';

export default [
	{ path: '', component: ModulesComponent, title: `${BASE_TITLE} - ${$localize`Modules`}` },
	{ path: ':id', component: ModuleDetailComponent, title: entityTitle(ModuleService, $localize`Modules`) },
] satisfies Routes;
