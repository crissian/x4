import type { TemplateRef } from '@angular/core';

export class MessageType {
  static primary = 'primary';
  static secondary = 'secondary';
  static success = 'success';
  static danger = 'danger';
  static warning = 'warning';
  static info = 'info';
}

export interface Message<C = unknown> {
  /** plain text, or a template from the caller's .html rendered with `context` */
  content: string | TemplateRef<C>;
  context?: C;
  type: string;
}
