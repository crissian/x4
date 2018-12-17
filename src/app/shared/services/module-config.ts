export interface ModuleConfig {
  moduleId?: string;
  count: number;
  production?: string;
}

export interface Layout {
  name: string;
  config: ModuleConfig[];
}
