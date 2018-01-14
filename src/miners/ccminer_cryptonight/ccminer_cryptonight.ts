import * as child_process from 'child_process';
import { LogParser } from './ccminer_cryptonight-log-parser';
import { Utils } from '../../utils';
import * as path from 'path';
import { EventEmitter } from 'events';
const spawn = child_process.spawn;
const exec = child_process.exec;
const logParser = new LogParser;

const ccminerLocation = path.resolve('./bin/ccminer_cryptonight/ccminer');

export class CCCryptonightMiner {

  utils = new Utils();
  script;
  log = new EventEmitter();

  start(pool, gpus) {
    const config = { pool: pool.url, user: pool.user, password: pool.password, gpus: gpus };
    this.startMiner(config);
    this.script.stderr.setEncoding('utf8');
    this.script.stderr.on('data', (data: string) => {
      const entry = logParser.parseLog(data);
      if (entry.type !== 'Unknown') {
        console.log(entry.type);
      } else {
        console.log(entry);
      }
      this.log.emit(entry.type, entry);
    });
    this.script.on('error', err => {
      console.error(err);
    });
    this.script.stdout.setEncoding('utf8');
    this.script.stdout.on('data', (data: string) => {
      const entry = logParser.parseLog(data);
      if (entry.type !== 'Unknown') {
        console.log(entry.type);
      } else {
        console.log(entry);
      }
      this.log.emit(entry.type, entry);
    });
    this.script.on('close', code => console.log(`Exited miner with code ${code}`));
    process.on('exit', function () {
      this.script.kill();
    });
  }

  stop() {
    console.log('Signalling the process to terminate');
    this.script.kill('SIGKILL');
  }

  private startMiner(config) {
    if (this.utils.getOS() === 'win32') {
      this.script = exec(this.generateWindowsCommand(config));
    } else if (this.utils.getOS() === 'linux') {
      this.script = spawn(ccminerLocation, this.generateLinuxCommand(config));
    } else if (this.utils.getOS() === 'darwin') {
      this.script = spawn(ccminerLocation, this.generateLinuxCommand(config));
    }
    return this.script;
  }

  private generateWindowsCommand(config) {
    let command = `${ccminerLocation} -o ${config.pool} -u ${config.user} -p ${config.password}`;
    if (config.gpus && Array.isArray(config.gpus)) {
      command += ` -d ${config.gpus.map(gpu => gpu.device).join(',')}`;
    }
    return command;
  }

  private generateLinuxCommand(config) {
    return [`-o ${config.pool}`, `-u ${config.user}`, `-p ${config.password}`];
  }

  private generateDarwinCommand(config) {
    return [`-o ${config.pool}`, `-u ${config.user}`, `-p ${config.password}`];
  }

}