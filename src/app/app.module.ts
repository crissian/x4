import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AnalyticsModule } from './google-analytics/analytics.module';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { StationModule } from './station/station.module';
import { StationRoutingModule } from './station/station-routing.module';
import { WareModule } from './ware/ware.module';
import { WareRoutingModule } from './ware/ware-routing.module';
import { ShipsModule } from './ship/ships.module';
import { ShipRoutingModule } from './ship/ship-routing.module';
import { ModuleModule } from './module/module.module';
import { ModuleRoutingModule } from './module/module-routing.module';
import { RaceModule } from './races/race.module';
import { RaceRoutingModule } from './races/race-routing.module';
import { FactionModule } from './faction/faction.module';
import { FactionRoutingModule } from './faction/faction-routing.module';
import { AboutComponent } from './about.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    StationModule,
    StationRoutingModule,
    WareModule,
    WareRoutingModule,
    StationModule,
    StationRoutingModule,
    ShipsModule,
    ShipRoutingModule,
    ModuleModule,
    ModuleRoutingModule,
    RaceModule,
    RaceRoutingModule,
    FactionModule,
    FactionRoutingModule,
    AnalyticsModule.forRoot({ trackingId: environment.googleAnalytics })
  ],
  declarations: [
    AppComponent,
    AboutComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
