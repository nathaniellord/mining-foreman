import { Miners } from '../../miners';
import { state } from '../../state';

export class MiningController {

  public getMiningStatus(req, res) {
    state.getMiners().then(miners => {
      res.json({ miners: miners.map(value => value.info) });
    });
  }

  public startMining(req, res) {
    const poolid = req.body.poolid;
    const gpus = req.body.gpus;
    // Start the miner and save it in the state
    const miner = new Miners();
    miner.startMining(poolid, gpus);
    res.json({ started: true });
  }

}