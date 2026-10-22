import { Component, model, type TemplateRef } from '@angular/core';
import { Message } from '../services/message';
import { AlertComponent } from './alert.component';
import { TemplateSlotDirective } from './template-slot.directive';

@Component({
	selector: 'app-messages',
	imports: [AlertComponent, TemplateSlotDirective],
	templateUrl: './messages.component.html',
})
export class MessagesComponent {
	readonly messages = model.required<Message[]>();

	close(message: Message) {
		this.messages.update((messages) => messages.filter((x) => x !== message));
	}

	/** The template of a templated message, or null for a plain text one. */
	protected template(message: Message): TemplateRef<unknown> | null {
		return typeof message.content === 'string' ? null : message.content;
	}
}
