import { CCMiner } from './ccminer/ccminer';
import { CCCryptonightMiner } from './ccminer_cryptonight/ccminer_cryptonight';
import { SGMiner } from './sgminer/sgminer';
import { ETHMiner } from './ethminer/ethminer';

export class Miner {

  miner;

  constructor() {

  }

  public start(minerName, pool, gpus) {
    this.miner = this.getMinerInstance(minerName);
    this.miner.start(pool, gpus);
  }

  public stop() {
    this.miner.stop();
  }

  public getMinerInstance(minerName) {
    let selectedMiner;
    switch (minerName) {
      case 'ccminer':
        selectedMiner = new CCMiner();
        break;
      case 'ccminer_cryptonight':
        selectedMiner = new CCCryptonightMiner();
        break;
      case 'sgminer':
        selectedMiner = new SGMiner();
        break;
      case 'ethminer':
        selectedMiner = new ETHMiner();
        break;
      default:
        throw 'Unknown miner';
    }
    return selectedMiner;
  }

}