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

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    StationCalculatorComponent,
    WaresComponent,
    WareDetailComponent
  ],
  imports: [
    NgbModule,
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
  ],
  providers: [
    WareService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
