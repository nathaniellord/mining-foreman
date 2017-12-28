import { MiningController } from '../controllers/mining.controller';
const miningController = new MiningController();
const MiningRoutes = function (app) {
  app.route('/mining')
    .get(miningController.getMiningStatus)
}
export { MiningRoutes };
