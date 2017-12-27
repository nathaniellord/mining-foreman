import * as child_process from 'child_process';
import { Utils } from './utils';
const exec = child_process.exec;

export class GPUtils {

  utils = new Utils();

  public async getGPUs() {
    let gpus = [];
    switch (this.utils.getOS()) {
      case 'win32':
        gpus = await this.getWindowsGPUs();
        break;
      case 'linux':
        gpus = await this.getLinuxGPUs();
        break;
      case 'darwin':
        gpus = await this.getMacGPUs();
        break;
      default:
        throw ('This OS is not supported')
    }
    return gpus;
  }

  private getWindowsGPUs(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const script = exec('wmic path win32_VideoController get name', (err, stdout, stderr) => {
        const gpus = this.processWindowsGPUOutput(stdout);
        return resolve(gpus);
      });
    });
  }

  private processWindowsGPUOutput(output): string[] {
    return output.split('\r\n')
      .map(value => value.replace('\r', '').trim())
      .filter(value => value.length !== 0 && value !== 'Name');
  }

  private getMacGPUs(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const script = exec('system_profiler | grep GeForce', (err, stdout, stderr) => {
        console.log(stdout);
      });
    });
  }

  private getLinuxGPUs(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const script = exec('sudo lshw -C display', (err, stdout, stderr) => {
        console.log(stdout);
      });
    });
  }

}