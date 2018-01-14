import { MiningController } from '../controllers/mining.controller';
const miningController = new MiningController();
const MiningRoutes = function (app) {
  app.route('/mining')
    .get(miningController.getMiningStatus);
  app.route('/mining/miner')
    .post(miningController.startMining);
  app.route('/mining/miner/:miner')
    .delete(miningController.stopMining)
}
export { MiningRoutes };
