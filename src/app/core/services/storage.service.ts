import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {
  // noinspection JSMethodCanBeStatic
  add(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // noinspection JSMethodCanBeStatic
  get<T>(key: string) {
    const json = localStorage.getItem(key);
    if (json) {
      return JSON.parse(json);
    }
    return null;
  }

  // noinspection JSMethodCanBeStatic
  delete(key: string) {
    localStorage.removeItem(key);
  }

  // noinspection JSMethodCanBeStatic
  clear() {
    localStorage.clear();
  }
}
