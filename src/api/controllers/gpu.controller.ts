import { GPUtils } from '../../gpus/gpus';
import { state } from '../../state';

export class GpuController {

  public getGpus(req, res) {
    const gputils = new GPUtils();
    state.getGPUs()
      .then(gpus => res.json({ gpus: gpus }))
      .catch(err => res.status(500).json({ error: err }));
  }

}