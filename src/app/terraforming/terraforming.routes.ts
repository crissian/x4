import { Routes } from '@angular/router';
import { BASE_TITLE } from '../shared/services/constants';
import { TerraformingProjectComponent } from './components/terraforming-project.component';
import TerraformingPageComponent from './components/terraforming-page.component';
import { TerraformingCatalog } from './terraforming-catalog';

const section = $localize`Terraforming`;

export default [
	{ path: '', component: TerraformingPageComponent, title: `${BASE_TITLE} - ${section}` },
	{
		path: 'projects/:id',
		component: TerraformingProjectComponent,
		title: (route) =>
			`${BASE_TITLE} - ${section} - ${new TerraformingCatalog().projectName(route.paramMap.get('id') ?? '')}`,
	},
] satisfies Routes;
