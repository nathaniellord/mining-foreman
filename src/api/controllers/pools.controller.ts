import { db } from '../../db';

export class PoolsController {

  public getPools(req, res) {
    res.json({ pools: db.pools() });
  }

  public savePool(req, res) {
    const pool = req.body.pool;
    db.savePool(pool);
    res.json({ pool: pool });
  }

}