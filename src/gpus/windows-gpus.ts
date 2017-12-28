import * as child_process from 'child_process';
const exec = child_process.exec;

export class WindowsGPUs {

  public getGPUs(): Promise<Object[]> {
    return new Promise((resolve, reject) => {
      exec('wmic path win32_VideoController', (err, stdout, stderr) => {
        this.parseOutput(stdout)
          .then(result => resolve(result));
      });
    });
  }

  private parseOutput(inputString): Promise<Object[]> {
    return new Promise((resolve, reject) => {
      const lines = inputString.split('\r\r\n');
      const properties = this.parseLine(lines.splice(0, 1)[0]);
      const valuesPromises = properties.map(property => {
        return this.getProperty(property);
      });
      Promise.all(valuesPromises)
        .then(result => resolve(this.generateGPUMap(result)))
        .catch(err => { console.error(err); reject(err); });
    });
  }

  private getProperty(name) {
    return new Promise((resolve, reject) => {
      exec(`wmic path win32_VideoController get ${name}`, (err, stdout, stderr) => {
        const values = this.processGPUOutput(stdout);
        return resolve(values);
      });
    });
  }

  private generateGPUMap(valuesArray): Object[] {
    const validIndexes = [];
    const validFields = valuesArray.map(entry => {
      return entry.map(item => item.length > 0);
    });
    const totalValidFields = validFields.reduce((accumulator, currentValue) => {
      const newValue = accumulator.map(value => typeof (value) === 'boolean' ? value ? 1 : 0 : value);
      currentValue.forEach((value, index) => {
        if (value) {
          newValue[index]++;
        }
      });
      return newValue;
    });
    totalValidFields.forEach((value, index) => {
      if (index !== 0 && value > 0) {
        validIndexes.push(index);
      }
    });
    const GPUs = validIndexes.map(index => {
      const gpu = {};
      valuesArray.forEach(entry => gpu[entry[0]] = entry[index]);
      return gpu;
    })
    return GPUs;
  }

  private parseLine(inputString) {
    let cleanLine = inputString.trim();
    const separatorRegex = /  */g;
    const newSeparator = '\t';
    const records = cleanLine.replace(separatorRegex, newSeparator).split(newSeparator);
    return records;
  }

  private processGPUOutput(output): string[] {
    return output.split('\r\r\n').map(value => value.trim());
  }

}