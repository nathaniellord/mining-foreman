export class MiningController {

  public getMiningStatus(req, res) {
    res.json({ status: true })
  }

  public startMining(req, res) {
    const GPUs = req.body.gpus;
    const wallet = req.body.wallet;
  }

}