export interface EntityService<T> {
  getEntity(id: any): T;
  getEntities(): T[];
}
