import { SystemRoutes } from './system.routes';
import { GpuRoutes } from './gpu.routes';

export class Routes {

  constructor(app) {
    SystemRoutes(app);
    GpuRoutes(app);
  }

}
