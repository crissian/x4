import { LayoutVersionService } from './layout-version.service';
import { Layout } from '../../shared/services/module-config';

export class LayoutV2Service implements LayoutVersionService {
  getLayouts(data: any): Layout[] {
    return data.layouts;
  }

  getSaveData(layouts: Layout[]) {
    return {
      layouts: layouts
    };
  }
}
