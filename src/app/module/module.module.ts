import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ModulesComponent } from './components/modules.component';
import { ModuleDetailComponent } from './components/module-detail.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ModuleRoutingModule } from './module-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    NgxDatatableModule,
    ModuleRoutingModule
  ],
  declarations: [
    ModulesComponent,
    ModuleDetailComponent
  ]
})
export class ModuleModule {
}
