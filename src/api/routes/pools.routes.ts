import { PoolsController } from '../controllers/pools.controller';
const poolsController = new PoolsController();
const PoolsRoutes = function (app) {
  app.route('/pools')
    .get(poolsController.getPools);
  app.route('/pools/pool')
    .post(poolsController.savePool);
}
export { PoolsRoutes };
