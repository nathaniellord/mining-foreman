import * as crypto from 'crypto';
import { CCMiner } from './ccminer/ccminer';
import { CCCryptonightMiner } from './ccminer_cryptonight/ccminer_cryptonight';
import { SGMiner } from './sgminer/sgminer';
import { ETHMiner } from './ethminer/ethminer';

export class Miner {

  private miner;
  private name;
  private gpus;
  private pool;
  private started;
  public info;
  public id;

  constructor() {

  }

  public start(minerName, pool, gpus) {
    this.name = minerName;
    this.gpus = gpus;
    this.pool = pool;
    this.started = new Date();
    this.id = crypto.createHash('md5').update(this.started + this.pool + this.name + JSON.stringify(gpus.map(value => value.device))).digest('hex');
    this.info = {
      id: this.id,
      name: minerName,
      pool: pool.url,
      currency: pool.currency,
      gpus: gpus.map(value => value.device),
      hashrate: 0,
      lastaccepted: undefined,
      accepted: 0,
      rejected: 0,
      threads: 0,
      difficulty: 0,
      started: this.started
    };
    this.miner = this.getMinerInstance(minerName);
    this.initializeLogHandler();
    this.miner.start(pool, gpus);
  }

  public stop() {
    console.log('Signalling the internal miner to stop.');
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