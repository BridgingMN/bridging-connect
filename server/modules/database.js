var Promise = require('bluebird');
var pg = Promise.promisifyAll(require('pg'));
var pool;

var config = {
  host: process.env.DATABASE_HOST || 'localhost',
  user: process.env.DATABASE_USER,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PW || '',
  port: 5432, // env var: PGPORT
  max: 20, // max number of clients in the pool
  idleTimeoutMillis: 15000, // 15s // how long a client is allowed to remain idle before being closed
};

if(!pool) { // is there a connection pool? if not, initialize one
  pool = new pg.Pool(config);
}

module.exports = pool;
