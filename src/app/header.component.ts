import { Component, Inject, LOCALE_ID, ChangeDetectionStrategy } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	standalone: false,
})
export class HeaderComponent {}
