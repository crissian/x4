import { Component, Input } from '@angular/core';
import { Message } from '../services/message';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html'
})
export class MessagesComponent {
  @Input()
  messages: Message[];

  close(message: Message) {
    const index = this.messages.indexOf(message);
    if (index >= 0) {
      this.messages.splice(index, 1);
    }
  }
}
