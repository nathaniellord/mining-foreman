import * as child_process from 'child_process';
const exec = child_process.exec;

export class LinuxGPUs {

  public getGPUs(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const script = exec('sudo lshw -C display', (err, stdout, stderr) => {
        console.log(stdout);
      });
    });
  }

}