import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModulesComponent } from './components/modules.component';
import { ModuleDetailComponent } from './components/module-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: ModulesComponent },
      { path: ':id', component: ModuleDetailComponent }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class ModuleRoutingModule {
}
