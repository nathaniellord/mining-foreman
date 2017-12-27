import * as child_process from 'child_process';
import { LogParser } from './ccminer-log-parser';
import { Utils } from '../../utils';
import * as path from 'path';
const spawn = child_process.spawn;
const exec = child_process.exec;
const logParser = new LogParser;

const ccminerLocation = path.resolve(['../../../bin/ccminer/']) + 'ccminer';
const wallet = 'etnkBdodFkrd6mod2fsX5j3SXe4UAvtRSNUWQEvrtbZ3MYW1aeWXvxZSLy9Dr9DwDQhtg5FfzNGrmaAwfCboQAk21cTeL69hxG';
const pool = 'stratum+tcp://etn.easyhash.io:3631';
const password = 'x';

export class Miner {

  utils = new Utils();

  start() {
    const config = { pool: pool, user: wallet, password: password };
    const script = this.startMiner(config);
    script.stderr.setEncoding('utf8');
    script.stderr.on('data', (data: string) => {
      const entry = logParser.parseLog(data);
      if (entry.type !== 'Unknown') {
        console.log(entry.type);
      } else {
        console.log(entry);
      }
    });
    script.on('error', err => {
      console.error(err);
    });
    script.stdout.setEncoding('utf8');
    script.stdout.on('data', (data: string) => {
      const entry = logParser.parseLog(data);
      if (entry.type !== 'Unknown') {
        console.log(entry.type);
      } else {
        console.log(entry);
      }
    });
    script.on('close', code => console.log(`Exited miner with code ${code}`));
    process.on('exit', function () {
      script.kill();
    });
  }

  private startMiner(config) {
    if (this.utils.getOS() === 'win32') {
      return exec(this.generateWindowsCommand(config));
    } else if (this.utils.getOS() === 'linux') {
      return spawn(ccminerLocation, this.generateLinuxCommand(config));
    } else if (this.utils.getOS() === 'darwin') {
      return spawn(ccminerLocation, this.generateLinuxCommand(config));
    }
  }

  private generateWindowsCommand(config) {
    return `${ccminerLocation} -o ${config.pool} -u ${config.user} -p ${config.password}`;
  }

  private generateLinuxCommand(config) {
    return [`-o ${config.pool}`, `-u ${config.user}`, `-p ${config.password}`];
  }

  private generateDarwinCommand(config) {
    return [`-o ${config.pool}`, `-u ${config.user}`, `-p ${config.password}`];
  }

}