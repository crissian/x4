import { Layout } from '../../shared/services/module-config';

export interface LayoutVersionService {
  getLayouts(data: any): Layout[];
  getSaveData(layouts: Layout[]): any;
}
