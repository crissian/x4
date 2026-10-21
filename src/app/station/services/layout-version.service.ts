import { Layout } from '../../shared/services/module-config';

export interface LayoutVersionService {
  getLayouts(data: unknown): Layout[];
  getSaveData(layouts: Layout[]): object | null;
}
