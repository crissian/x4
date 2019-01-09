export interface ModuleConfig {
  moduleId?: string;
  count: number;
}

export interface Layout {
  name: string;
  resourcesPrice?: number;
  productsPrice?: number;
  modulesResourcesPrice?: number;
  provideBasicResources?: boolean;
  isHeadquarters?: boolean;
  config: ModuleConfig[];
}
