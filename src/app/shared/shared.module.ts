import { NgModule } from '@angular/core';
import { WareService } from './services/ware.service';
import { CoreModule } from '../core/core.module';
import { HeaderComponent } from './components/header.component';
import { BrowserModule } from '@angular/platform-browser';
import { MessagesComponent } from './components/messages.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ConfirmComponent } from './components/confirm.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ModuleService } from './services/module.service';
import { RaceService } from './services/race.service';
import { FactionService } from './services/faction.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    CoreModule,
    RouterModule,
    NgbModalModule
  ],
  providers: [
    WareService,
    ModuleService,
    RaceService,
    FactionService
  ],
  declarations: [
    HeaderComponent,
    MessagesComponent,
    ConfirmComponent
  ],
  entryComponents: [
    ConfirmComponent
  ],
  exports: [
    HeaderComponent,
    MessagesComponent,
    ConfirmComponent
  ]
})
export class SharedModule {
}
