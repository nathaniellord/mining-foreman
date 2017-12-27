import * as os from 'os';

export class Utils {

  public getOS() {
    return os.platform();
  }

}