export interface ModuleConfig {
  moduleId?: string;
  count: number;
}

export interface Layout {
  name: string;
  config: ModuleConfig[];
}
