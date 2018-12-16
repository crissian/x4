export interface ModuleConfig {
  moduleId?: number;
  count: number;
}

export interface Layout {
  name: string;
  config: ModuleConfig[];
}
