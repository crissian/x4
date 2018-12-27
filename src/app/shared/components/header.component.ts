import {Component, Inject, LOCALE_ID} from '@angular/core';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  languages = environment.languages;

  constructor(@Inject(LOCALE_ID) protected localeId: string) {
  }
}
