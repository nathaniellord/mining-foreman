import { CurrenciesController } from '../controllers/currencies.controller';
const currenciesController = new CurrenciesController();
const CurrenciesRoutes = function (app) {
  app.route('/currencies')
    .get(currenciesController.getCurrencies);
  app.route('/currencies/stats')
    .get(currenciesController.getStats);
}
export { CurrenciesRoutes };
