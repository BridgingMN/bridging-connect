var pg = require('pg');
var config = require('./config.js');
var pool;
var config = {
  user: config.PG_USERNAME, // env var: PGUSER
  database: 'bridging', // env var: PGDATABASE
  password: '', // env var: PGPASSWORD
  port: 5432, // env var: PGPORT
  max: 20, // max number of clients in the pool
  idleTimeoutMillis: 15000, // 15s // how long a client is allowed to remain idle before being closed
};

if(!pool) { // is there a connection pool? if not, initialize one
  pool = new pg.Pool(config);
}

module.exports = pool;
