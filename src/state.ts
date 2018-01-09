import { GPUtils } from './gpus/gpus';

class State {

  gpus;
  miners = [];

  initialize() {
    this.getGPUs();
  }

  public async getGPUs() {
    const gputils = new GPUtils();
    if (!this.gpus) {
      this.gpus = await gputils.getGPUs();
    }
    return this.gpus;
  }

  public async getMiners() {
    return this.miners;
  }

  public async addMiner(miner) {
    this.miners.push(miner);
  }

  public async removeMiner(miner) {
    return;
  }

}
export let state = new State();