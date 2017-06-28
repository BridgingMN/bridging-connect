var Promise = require('bluebird');
var pg = Promise.promisifyAll(require('pg'));
var pool;
var config = {
  user:process.env.PG_USERNAME, // env var: PGUSER
  database: 'bridging', // env var: PGDATABASE
  password: '', // env var: PGPASSWORD
  port: 5432, // env var: PGPORT
  max: 20, // max number of clients in the pool
  idleTimeoutMillis: 15000, // 15s // how long a client is allowed to remain idle before being closed
};

console.log(config);

if(!pool) { // is there a connection pool? if not, initialize one
  pool = new pg.Pool(config);
}

module.exports = pool;
