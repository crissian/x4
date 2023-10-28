export interface ModuleConfig {
   moduleId?: string;
   count: number;
}

export interface Layout {
   name: string;
   resourcesPrice?: number;
   productsPrice?: number;
   sunlight?: number;
   modulesResourcesPrice?: number;
   provideBasicResources?: boolean;
   provideAllResources?: boolean;
   isHeadquarters?: boolean;
   config: ModuleConfig[];
}
