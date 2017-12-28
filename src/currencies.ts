import * as request from 'request';

const currencies = [
  { name: 'Ethereum', algorithm: 'eth', symbol: 'ETH' },
  { name: 'Dash', algorithm: 'x11', symbol: 'DSH' },
  { name: 'NEM', algorithm: 'eth', symbol: 'XEM' },
  { name: 'Ethereum Classic', algorithm: 'eth', symbol: 'ETC' },
  { name: 'Monero', algorithm: 'cryptonight', symbol: 'XMR' },
  { name: 'Zcash', algorithm: 'equihash', symbol: 'ZEC' },
  { name: 'Electroneum', algorithm: 'cryptonight', symbol: 'ETN' }
];

export class Currencies {

  public getCurrencies() {
    return currencies;
  }

  public getStats() {
    return new Promise((resolve, reject) => {
      request('https://api.coinmarketcap.com/v1/ticker/', function (err, response, body) {
        resolve(JSON.parse(body));
      });
    });
  }

}