import { CCMiner } from './ccminer/ccminer';
import { CCCryptonightMiner } from './ccminer_cryptonight/ccminer_cryptonight';
import { SGMiner } from './sgminer/sgminer';
import { ETHMiner } from './ethminer/ethminer';

export class Miner {

  private miner;
  private name;
  private gpus;
  private pool;
  public info;

  constructor() {

  }

  public start(minerName, pool, gpus) {
    this.name = minerName;
    this.gpus = gpus;
    this.pool = pool;
    this.info = {
      name: minerName,
      pool: pool.url,
      gpus: gpus.map(value => value.device),
      hashrate: 0,
      lastaccepted: undefined,
      accepted: 0,
      rejected: 0,
      threads: 0,
      difficulty: 0
    };
    this.miner = this.getMinerInstance(minerName);
    this.initializeLogHandler();
    this.miner.start(pool, gpus);
  }

  public stop() {
    this.miner.stop();
  }

  public initializeLogHandler() {
    this.miner.log.on('Accepted', event => {
      this.info.hashrate = event.data.speed;
      this.info.accepted = event.data.accepted;
      this.info.rejected = event.data.submitted - event.data.accepted;
      this.info.lastaccepted = event.date;
    });
    this.miner.log.on('ThreadsStarted', event => {
      this.info.threads = event.data.threads;
    });
    this.miner.log.on('Diff', event => {
      this.info.difficulty = event.data.difficulty
    });
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