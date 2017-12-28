import { SystemRoutes } from './system.routes';
import { GpuRoutes } from './gpu.routes';
import { CurrenciesRoutes } from './currencies.routes';
import { MiningRoutes } from './mining.routes';
import { PoolsRoutes } from './pools.routes';

export class Routes {

  constructor(app) {
    SystemRoutes(app);
    GpuRoutes(app);
    CurrenciesRoutes(app);
    MiningRoutes(app);
    PoolsRoutes(app);
  }

}
