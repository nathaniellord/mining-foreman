import { Currencies } from '../../currencies';

export class CurrenciesController {

  public getCurrencies(req, res) {
    const currencies = new Currencies();
    const curr = currencies.getCurrencies();
    res.json({ currencies: curr });
  }

  public getStats(req, res) {
    const currencies = new Currencies();
    currencies.getStats().then(stats => {
      res.json({ stats: stats });
    })
  }

}