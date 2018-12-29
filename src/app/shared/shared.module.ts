import { NgModule } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { WareService } from './services/ware.service';
import { CoreModule } from '../core/core.module';
import { BrowserModule } from '@angular/platform-browser';
import { MessagesComponent } from './components/messages.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ConfirmComponent } from './components/confirm.component';
import { ModuleService } from './services/module.service';
import { RaceService } from './services/race.service';
import { FactionService } from './services/faction.service';
import { ShipService } from './services/ship.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    CoreModule,
    RouterModule,
    NgbDropdownModule
  ],
  providers: [
    WareService,
    ModuleService,
    RaceService,
    FactionService,
    ShipService
  ],
  declarations: [
    MessagesComponent,
    ConfirmComponent
  ],
  entryComponents: [
    ConfirmComponent
  ],
  exports: [
    MessagesComponent,
    ConfirmComponent
  ]
})
export class SharedModule {
}
