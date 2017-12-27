import * as express from 'express';
import * as bodyParser from 'body-parser';

import { Cors } from './cors';
import { Routes } from './api/routes/routes';

import { Miners } from './miners';

const app = express();
const port = process.env.PORT || 3050;

const miners = new Miners();
miners.downloadMiners();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Initialize the cors rules
new Cors(app);
// Initialize the app routes. All routes go through the routes file and are distributed to the various routes files
new Routes(app);

app.listen(port);
console.log('Application up and running on port ' + port);