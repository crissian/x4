import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {appRoutes} from './app.routes';

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { useHash: true, relativeLinkResolution: 'legacy' }),
  ]
})
export class AppRoutingModule {
}
