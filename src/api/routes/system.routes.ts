import { SystemController } from '../controllers/system.controller';
const systemController = new SystemController();
const SystemRoutes = function (app) {
  app.route('/system')
    .get(systemController.getHeartbeat)
}
export { SystemRoutes };
