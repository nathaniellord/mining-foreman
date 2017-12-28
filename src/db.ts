const dataDirectory = 'data';
const poolStore = require('data-store')('pools', { cwd: dataDirectory });

class DB {

  constructor() {
    if (!poolStore.has('pools')) {
      poolStore.set('pools', []);
      poolStore.save();
    }
  }

  public pools() {
    return poolStore.get('pools');
  }

  public savePool(pool) {
    let pools = this.pools();
    pools = pools.filter(value => value !== null);
    const exists = pools.filter(value => value.url === pool.url).length > 0;
    if (!exists) {
      pools.push(pool);
    } else {
      pools = pools.map(value => value.url === pool.url ? pool : value);
    }
    poolStore.set('pools', pools);
    poolStore.save();
    return pool;
  }

}

export let db = new DB();