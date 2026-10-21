import { Component, model } from '@angular/core';
import { Message } from '../services/message';
import { AlertComponent } from './alert.component';

@Component({
	selector: 'app-messages',
	imports: [AlertComponent],
	templateUrl: './messages.component.html',
})
export class MessagesComponent {
	readonly messages = model.required<Message[]>();

	close(message: Message) {
		this.messages.update((messages) => messages.filter((x) => x !== message));
	}
}
