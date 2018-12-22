import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModulesComponent } from './components/modules.component';
import { ModuleDetailComponent } from './components/module-detail.component';
import { ModuleModule } from './module.module';

@NgModule({
  imports: [
    ModuleModule,
    RouterModule.forChild([
      {
        path: 'modules',
        children: [
          { path: '', component: ModulesComponent },
          { path: ':id', component: ModuleDetailComponent }
        ]
      }
    ])
  ]
})
export class ModuleRoutingModule {
}
