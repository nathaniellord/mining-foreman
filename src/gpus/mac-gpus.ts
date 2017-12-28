import * as child_process from 'child_process';
const exec = child_process.exec;

export class MacGPUs {

  public getGPUs(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const script = exec('system_profiler | grep GeForce', (err, stdout, stderr) => {
        console.log(stdout);
      });
    });
  }

}