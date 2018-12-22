export class MessageType {
  static primary = 'primary';
  static secondary = 'secondary';
  static success = 'success';
  static danger = 'danger';
  static warning = 'warning';
  static info = 'info';
}

export interface Message {
  content: string;
  type: string;
}
