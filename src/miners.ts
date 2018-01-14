import * as zip from 'adm-zip';
import * as fs from 'fs';
import * as path from 'path';
import * as request from 'request';

import { Currencies } from './currencies';
import { GPUtils } from './gpus/gpus';
import { state } from './state';
import { db } from './db';
import { Miner } from './miners/miner';

export class Miners {

  miners = [
    { name: 'ccminer', location: 'https://github.com/KlausT/ccminer/releases/download/8.17/ccminer-817-cuda91-x64.zip', version: '8.17', platform: ['NVIDIA'], folder: '', algorithms: ['bitcoin', 'blake', 'blakecoin', 'c11', 'deep', 'dmd-gr', 'fresh', 'fugue256', 'groestl', 'jackpot', 'keccak', 'luffa', 'lyra2v2', 'myr-gr', 'neoscrypt', 'nist5', 'penta', 'quark', 'qubit', 'sia', 'skein', 's3', 'x11', 'x13', 'x14', 'x15', 'x17', 'vanilla', 'whirl', 'whirlpoolx'] },
    { name: 'sgminer', location: 'https://github.com/genesismining/sgminer-gm/releases/download/5.5.5/sgminer-gm.zip', version: '5.5.5', platform: ['AMD'], folder: 'sgminer-gm/', algorithms: ['sha256', 'equihash', 'scrypt', 'x11', 'x13', 'x15', 'x17', 'cryptonight'] },
    { name: 'ethminer', location: 'http://cryptomining-blog.com/wp-content/download/ethereum-mining-windows-alt.zip', version: '1.0.0', platform: ['NVIDIA', 'AMD'], folder: 'eth/', algorithms: ['ethash'] },
    { name: 'ccminer_cryptonight', location: 'https://github.com/tsiv/ccminer-cryptonight/releases/download/v0.17/ccminer-cryptonight_20140926.zip', version: '0.17', platform: ['NVIDIA'], folder: '', algorithms: ['cryptonight'] },
  ]

  constructor() {
    this.generateBinFolder();
  }

  public getMiners() {
    return this.miners;
  }

  public setup() {
    this.downloadMiners();
  }

  private generateBinFolder() {
    if (!fs.existsSync('./bin')) {
      console.log('Creating miner binary directory');
      fs.mkdirSync('./bin');
    }
  }

  public downloadMiners() {
    this.miners.forEach(miner => {
      if (!this.minerInstalled(miner)) {
        this.downloadMiner(miner);
      }
    })
  }

  private minerInstalled(miner) {
    return fs.existsSync(`./bin/${miner.name}`);
  }

  private downloadMiner(miner) {
    const filePath = path.resolve(`./bin/${miner.name}.zip`);
    console.log(`Downloading Miner
  name: ${miner.name}
  version: ${miner.version}
  from: ${miner.location}
  to: ${filePath}`);
    request(miner.location)
      .pipe(fs.createWriteStream(filePath))
      .on('close', () => {
        console.log(`Miner Successfully Downloaded: ${miner.name}`);
        this.unzipMiner(miner);
      });
  }

  private unzipMiner(miner) {
    const zippedMiner = new zip(`./bin/${miner.name}.zip`);
    const outputDirectory = `./bin/${miner.name}`;
    if (!fs.existsSync(outputDirectory)) {
      fs.mkdirSync(outputDirectory);
    }
    if (miner.folder.length) {
      zippedMiner.extractEntryTo(miner.folder, outputDirectory, false, true);
    } else {
      zippedMiner.extractAllTo(outputDirectory, true);
    }
  }

  public async startMining(poolid, gpus) {
    const pools = db.pools();
    const pool = pools.filter(value => value.poolid == poolid)[0];
    const currencies = new Currencies().getCurrencies();
    const currency = currencies.filter(value => value.symbol == pool.currency)[0];
    // Determine what the algorithm is from the currency associated with the pool
    const algo = currency.algorithm;
    // Select the appropriate miner and initialize it
    const miners = this.getMiners();
    // If an empty array or object is passed in for the gpus then we're using all GPUs
    const SystemGpus = await new GPUtils().getGPUs();
    let miningGpus = SystemGpus;
    if (gpus && gpus.length > 0) {
      miningGpus = miningGpus.filter(value => gpus.includes(value.device));
    }
    const compatibleMiners = miningGpus.map(gpu => this.getCompatibleMiner(algo, gpu.platform))
      .reduce((accumulator, newValue) => accumulator.concat(newValue));
    const unique = [...new Set(compatibleMiners.map(item => item.name))];
    // If there's only one compatible miner then we'll go ahead and spawn a single instance for all of the selected GPUs
    if (unique.length === 1) {
      const miner = new Miner();
      miner.start(unique[0], pool, miningGpus);
      state.addMiner(miner);
    } else {
      // Otherwise we're going to have to spawn a different miner for each type of GPU
    }
    return;
  }

  public async stopMiner(minerId) {
    const activeMiner = state.miners.filter(miner => miner.id === minerId)[0];
    console.log('Signalling the miner to stop.');
    activeMiner.stop();
    state.miners = state.miners.filter(value => value.id !== minerId);
  }

  public getCompatibleMiner(algorithm, platform) {
    const miners = new Miners().getMiners();
    return miners.filter(m => m.algorithms.includes(algorithm) && m.platform.includes(platform));
  }

}