import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from "../environments/environment";
import { AnalyticsModule } from "./google-analytics/analytics.module";
import { HeaderComponent } from "./header.component";
import { AboutComponent } from "./about.component";
import { FormsModule } from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AnalyticsModule.forRoot({ trackingId: environment.googleAnalytics }),
    NgbModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
