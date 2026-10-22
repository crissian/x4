import { Component, input, output } from '@angular/core';
import { LucideCircleCheck, LucideCircleAlert, LucideTriangleAlert, LucideInfo, LucideX } from '@lucide/angular';

@Component({
	selector: 'app-alert',
	imports: [LucideCircleCheck, LucideCircleAlert, LucideTriangleAlert, LucideInfo, LucideX],
	host: {
		role: 'alert',
	},
	templateUrl: './alert.component.html',
})
export class AlertComponent {
	readonly type = input('info');
	readonly closed = output();
}
