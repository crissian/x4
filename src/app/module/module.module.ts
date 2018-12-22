import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ModulesComponent } from './components/modules.component';
import { ModuleDetailComponent } from './components/module-detail.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    NgbModule,
    BrowserModule,
    FormsModule,
    SharedModule,
    RouterModule,
    NgxDatatableModule
  ],
  declarations: [
    ModulesComponent,
    ModuleDetailComponent
  ]
})
export class ModuleModule {
}
