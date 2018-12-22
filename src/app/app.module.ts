import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AnalyticsModule } from './google-analytics/analytics.module';
import { environment } from '../environments/environment';
import {AppRoutingModule} from './app-routing.module';
import {CoreModule} from './core/core.module';
import {SharedModule} from './shared/shared.module';
import {StationModule} from './station/station.module';
import {StationRoutingModule} from './station/station-routing.module';
import {WareModule} from './ware/ware.module';
import {WareRoutingModule} from './ware/ware-routing.module';

@NgModule({
  imports: [
    NgbModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    StationModule,
    StationRoutingModule,
    WareModule,
    WareRoutingModule,
    RouterModule,
    AnalyticsModule.forRoot({ trackingId: environment.googleAnalytics })
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
