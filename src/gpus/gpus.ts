import * as child_process from 'child_process';
import { Utils } from '../utils';
import * as fs from 'fs';
import { WindowsGPUs } from './windows-gpus';
import { MacGPUs } from './mac-gpus';
import { LinuxGPUs } from './linux-gpus';
const exec = child_process.exec;

export class GPUtils {

  utils = new Utils();

  public async getGPUs() {
    let gpus = [];
    switch (this.utils.getOS()) {
      case 'win32':
        const windowsGPUs = new WindowsGPUs;
        gpus = await windowsGPUs.getGPUs();
        break;
      case 'linux':
        const linuxGPUs = new LinuxGPUs;
        gpus = await linuxGPUs.getGPUs();
        break;
      case 'darwin':
        const macGPUs = new MacGPUs;
        gpus = await macGPUs.getGPUs();
        break;
      default:
        throw ('This OS is not supported')
    }
    return gpus;
  }

}