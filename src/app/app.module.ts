import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AnalyticsModule } from './google-analytics/analytics.module';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AboutComponent } from './about.component';
import { HeaderComponent } from './header.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    AnalyticsModule.forRoot({ trackingId: environment.googleAnalytics })
  ],
  declarations: [
    AppComponent,
    AboutComponent,
    HeaderComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
