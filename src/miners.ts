import * as zip from 'adm-zip';
import * as fs from 'fs';
import * as path from 'path';
import * as request from 'request';

export class Miners {

  miners = [
    { name: 'ccminer', location: 'https://github.com/KlausT/ccminer/releases/download/8.17/ccminer-817-cuda91-x64.zip', version: '8.17', folder: '' },
    { name: 'sgminer', location: 'https://github.com/genesismining/sgminer-gm/releases/download/5.5.5/sgminer-gm.zip', version: '5.5.5', folder: 'sgminer-gm/' },
    { name: 'ethminer', location: 'http://cryptomining-blog.com/wp-content/download/ethereum-mining-windows-alt.zip', version: '1.0.0', folder: 'eth/' }
  ]

  constructor() {
    this.generateBinFolder();
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

}