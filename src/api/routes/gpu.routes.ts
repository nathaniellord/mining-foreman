import { GpuController } from '../controllers/gpu.controller';
const gpuController = new GpuController();
const GpuRoutes = function (app) {
  app.route('/gpus')
    .get(gpuController.getGpus)
}
export { GpuRoutes };
