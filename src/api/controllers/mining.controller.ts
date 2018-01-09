import { Miners } from '../../miners';

export class MiningController {

  public getMiningStatus(req, res) {
    res.json({ status: true })
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