const DateBracketsRegex = /\[(.*?)\]/;
const MessageFormats = [
  { type: 'GPU', regex: /GPU #(\d+): (.*), (.*)(\(.*\))?/ },
  { type: 'Stratum', regex: /Stratum detected new block/ },
  { type: 'Diff', regex: /Pool set diff to (.+)/ },
  { type: 'Accepted', regex: /accepted: (\d+)\/(\d+) \((\d+\.\d+)%\), (\d+\.\d+) (.+) \(yay!!!\)/ },
  { type: 'UsingConnector', regex: /Using (.+)/ },
  { type: 'StratumStart', regex: /Starting Stratum on (.*)/ },
  { type: 'ThreadsStarted', regex: /(\d+) miner threads started, using '(.*)' algorithm/ },
  { type: 'ConnectionInterrupted', regex: /Stratum connection interrupted/ },
  { type: 'ConnectionTimedOut', regex: /Stratum connection timed out/ }
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
    } else if (message.match(this.getRegex('StratumStart'))) {
      entry.type = 'StratumStart';
      entry.data = this.processStratumStartMessage(message);
    } else if (message.match(this.getRegex('ThreadsStarted'))) {
      entry.type = 'ThreadsStarted';
      entry.data = this.processThreadsStartedMessage(message);
    } else if (message.match(this.getRegex('ConnectionInterrupted'))) {
      entry.type = 'ConnectionInterrupted';
    } else if (message.match(this.getRegex('ConnectionTimedOut'))) {
      entry.type = 'ConnectionTimedOut';
    } else {
      entry.type = 'Unknown';
      entry.data = { message: message };
      console.log(message);
    }
    return entry;
  }

  private parseDate(logEntry: string) {
    return logEntry.match(DateBracketsRegex) === null ? new Date() : new Date(logEntry.match(DateBracketsRegex)[1]);
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

  private processThreadsStartedMessage(message) {
    const parts = message.match(this.getRegex('ThreadsStarted'));
    const data = {
      threads: parts[1],
      algorithm: parts[2]
    }
    return data;
  }

  private processStratumStartMessage(message) {
    const parts = message.match(this.getRegex('StratumStart'));
    const data = {
      stratum: parts[1]
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