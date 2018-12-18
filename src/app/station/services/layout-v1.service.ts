import { Layout } from '../../shared/services/module-config';
import { LayoutVersionService } from './layout-version.service';

export class LayoutV1Service implements LayoutVersionService {
  getLayouts(data: any): Layout[] {
    return data.layouts;
  }

  getSaveData(layouts: Layout[]) {
    return {
      layouts: layouts
    };
  }
}
