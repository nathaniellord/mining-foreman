export interface CCMinerConfig {
  user: string;
  password: string;
  url: string;
  devices?: string[];
  trustPool?: string;
  sslCert?: string;
  proxy?: string;
  threads?: number;
  retries?: number;
  retryPause?: number;
  timeout?: number;
  scanTime?: number;
  debug?: boolean;
}