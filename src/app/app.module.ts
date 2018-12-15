import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './components/header.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';
import { StationCalculatorComponent } from './components/station-calculator.component';
import { WareService } from './services/ware.service';
import { WaresComponent } from './components/wares.component';
import { WareDetailComponent } from './components/ware-detail.component';
import { AnalyticsModule } from './google-analytics/analytics.module';
import { environment } from '../environments/environment';
import { ShareLayoutComponent } from './components/share-layout.component';
import { SaveLayoutComponent } from './components/save-layout.component';
import { StorageService } from './services/storage.service';
import { LayoutService } from './services/layout-service';
import { MessagesComponent } from './components/messages.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    StationCalculatorComponent,
    WaresComponent,
    WareDetailComponent,
    ShareLayoutComponent,
    SaveLayoutComponent,
    MessagesComponent
  ],
  entryComponents: [
    ShareLayoutComponent,
    SaveLayoutComponent
  ],
  imports: [
    NgbModule,
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    AnalyticsModule.forRoot({ trackingId: environment.googleAnalytics })
  ],
  providers: [
    WareService,
    StorageService,
    LayoutService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
