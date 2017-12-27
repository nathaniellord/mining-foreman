
const DateBracketsRegex = /\[(.*?)\]/;
const MessageFormats = [
  { type: 'GPU', regex: /GPU #(\d+): (.*), (.*)(\(.*\))?/ },
  { type: 'Stratum', regex: /Stratum detected new block/ },
  { type: 'Diff', regex: /Pool set diff to (.+)/ },
  { type: 'Accepted', regex: /accepted: (\d+)\/(\d+) \((\d+\.\d+)%\), (\d+\.\d+) (.+) \(yay!!!\)/ },
  { type: 'UsingConnector', regex: /Using (.+)/ }
]

interface LogEntry {
  date: Date;
  type: string;
  data: Object;
}
export class LogParser {

  public parseLog(logEntry: string) {
    const entry = {
      date: this.parseDate(logEntry),
      type: 'Unknown',
      data: {}
    };
    const message = logEntry.replace(DateBracketsRegex, '').trim();
    if (message.match(this.getRegex('GPU'))) {
      entry.type = 'GPU';
      entry.data = this.processGPUMessage(message);
    } else if (message.match(this.getRegex('Stratum'))) {
      entry.type = 'Stratum';
    } else if (message.match(this.getRegex('Diff'))) {
      entry.type = 'Diff';
      entry.data = this.processDiffMessage(message);
    } else if (message.match(this.getRegex('Accepted'))) {
      entry.type = 'Accepted';
      entry.data = this.processAcceptedMessage(message);
    } else if (message.match(this.getRegex('UsingConnector'))) {
      entry.type = 'UsingConnector';
      entry.data = this.processUsingConnectorMessage(message);
    } else {
      entry.type = 'Unknown';
      entry.data = { message: message };
      console.log(message);
    }
    return entry;
  }

  private parseDate(logEntry: string) {
    return new Date(logEntry.match(DateBracketsRegex)[1]);
  }

  private processGPUMessage(message) {
    const parts = message.match(this.getRegex('GPU'));
    const data = {
      id: parts[1],
      name: parts[2],
      speed: parts[3],
      average: parts[4]
    }
    return data;
  }

  private processDiffMessage(message) {
    const parts = message.match(this.getRegex('Diff'));
    const data = {
      difficulty: parseFloat(parts[1])
    };
    return data;
  }

  private processAcceptedMessage(message) {
    const parts = message.match(this.getRegex('Accepted'));
    const data = {
      submitted: parts[1],
      accepted: parts[2],
      percent: parts[3],
      speed: parts[4],
      scale: parts[5]
    };
    return data;
  }

  private processUsingConnectorMessage(message) {
    const parts = message.match(this.getRegex('UsingConnector'));
    const data = {
      connector: parts[1]
    };
    return data;
  }

  private getRegex(name) {
    return MessageFormats.filter(value => value.type === name)[0].regex;
  }

}