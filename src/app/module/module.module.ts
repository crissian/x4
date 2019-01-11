import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ModulesComponent } from './components/modules.component';
import { ModuleDetailComponent } from './components/module-detail.component';
import { ModuleRoutingModule } from './module-routing.module';
import { CommonModule } from '@angular/common';
import { DxDataGridModule } from 'devextreme-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    DxDataGridModule,
    ModuleRoutingModule
  ],
  declarations: [
    ModulesComponent,
    ModuleDetailComponent
  ]
})
export class ModuleModule {
}
