import { GPUtils } from '../../gpus';

export class GpuController {

  public getGpus(req, res) {
    const gputils = new GPUtils();
    gputils.getGPUs()
      .then(gpus => res.json({ gpus: gpus }))
      .catch(err => res.status(500).json({ error: err }));
  }

}