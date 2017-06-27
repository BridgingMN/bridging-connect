var express = require('express');
var router = express.Router();
var formatters = require('../modules/formatters.js');
var formatDate = formatters.formatDate;
var formatTime = formatters.formatTime;
var formatDateForPostgres = formatters.formatDateForPostgres;
var formatClient = formatters.formatClient;

var pool = require('../modules/database.js');
/**
  * @api {post} /clients Add a client
  * @apiVersion 0.1.1
  * @apiName PostClient
  * @apiGroup Clients
  * @apiDescription Saves a client's information to database

  * @apiParam {String} first   First name of client
  * @apiParam {String} last   Last name of client
  * @apiParam {Date} dob  Client date of birth
  * @apiParam {String} race_ethnicity   Client race or ethnicity.
      Options: "African", "American Indian or Alaska Native",
      "Asian or Pacific Islander", "Black or African American", "Hispanic",
      "Mixed Racial Background", "White", "Other"
  * @apiParam {String} street   Street address of client
  * @apiParam {String} city   City of client address
  * @apiParam {String} state  State of client address (2-letter abbreviation)
  * @apiParam {String} zip_code   Client zip code

  * @apiSuccess {Number} id Unique ID of client that has been added
  * @apiErrorExample {json} Post error
  *    HTTP/1.1 500 Internal Server Error
*/
router.post('/', function(req, res) {
  var client = req.body;

  console.log('client from other side', client);
  var first = client.first;
  var last = client.last;
  var dob = formatDateForPostgres(client.dob);
  var race_ethnicity = client.race_ethnicity;
  var street = client.street;
  var city = client.city;
  var state = client.state;
  var zip_code = client.zip_code;

  postClient(first, last, dob, race_ethnicity, street, city, state, zip_code)
  .then(function(result, error) {
    if (error) {
      console.log(error);
      res.sendStatus(500);
    } else {
      res.send(result);
    }
  });
});

function postClient(first, last, dob, race_ethnicity, street, city, state, zip_code) {

  return pool.connect().then(function(client) {
    return client.query('INSERT INTO "clients" ("first", "last", "dob", "race_ethnicity_id", "street", "city", "state", "zip_code") ' +
    'VALUES ($1, $2, $3, ' +
    '(SELECT "id" FROM "race_ethnicity" WHERE "race_ethnicity" = $4),' +
    '$5, $6, $7, $8) RETURNING "id"',
    [first, last, dob, race_ethnicity, street, city, state, zip_code])
    .then(function(result) {
      client.release();
      return result.rows[0];
    })
    .catch(function(error) {
      client.release();
      console.error('query error', error.message, error.stack);
      return error;
    });
  });
}

/**
  * @api {post} /clients/:client_id Get All Info for a Client
  * @apiVersion 0.1.1
  * @apiName GetClient
  * @apiGroup Clients
  * @apiDescription Returns all info from client referral form for a particular client

  * @apiSuccess {Number} id   Unique ID of client
  * @apiSuccess {String} first   First name of client
  * @apiSuccess {String} last   Last name of client
  * @apiSuccess {Date} dob  Client date of birth
  * @apiSuccess {String} race_ethnicity   Client race or ethnicity.
      Options: "African", "American Indian or Alaska Native",
      "Asian or Pacific Islander", "Black or African American", "Hispanic",
      "Mixed Racial Background", "White", "Other"
  * @apiSuccess {String} street   Street address of client
  * @apiSuccess {String} city   City of client address
  * @apiSuccess {String} state  State of client address (2-letter abbreviation)
  * @apiSuccess {String} zip_code   Client zip code

  * @apiErrorExample {json} Post error
  *    HTTP/1.1 500 Internal Server Error
*/
router.get('/:client_id', function(req, res) {
  var client_id = req.params.client_id;
  pool.connect(function(connectionError, db, done) {
    if (connectionError) {
      console.log(connectionError, 'ERROR CONNECTING TO DATABASE');
      res.sendStatus(500);
    } else {
      db.query('SELECT * FROM "clients" WHERE "id" = $1',
      [client_id],
      function(queryError, result){
        done();
        if (queryError) {
          console.log('ERROR MAKING QUERY');
          res.sendStatus(500);
        } else {
          var clientObj = formatClient(result.rows);
          console.log('THIS SHOULD SAY CLIENT_ID', clientObj);
          res.send(clientObj);
        }
      });
    }
  });
});

/**
  * @api {put} /clients Update client
  * @apiVersion 0.1.0
  * @apiName UpdateClient
  * @apiGroup Clients
  * @apiDescription Changes specified properties for a client and changes them to new values

  * @apiParam {Number} client_id  Unique ID of client
  * @apiParam {String} first   First name of client
  * @apiParam {String} last   Last name of client
  * @apiParam {Date} dob  Client date of birth
  * @apiParam {String} race_ethnicity   Client race or ethnicity.
      Options: "African", "American Indian or Alaska Native",
      "Asian or Pacific Islander", "Black or African American", "Hispanic",
      "Mixed Racial Background", "White", "Other"
  * @apiParam {String} street   Street address of client
  * @apiParam {String} city   City of client address
  * @apiParam {String} state  State of client address (2-letter abbreviation)
  * @apiParam {String} zip_code   Client zip code
  *
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  * @apiErrorExample Not found error
  *    HTTP/1.1 404 Not found
*/
router.put('/', function(req, res) {
  var client = req.body;
  console.log('client from other side', client);
  var client_id = client.client_id;
  var first = client.first;
  var last = client.last;
  var dob = formatDateForPostgres(client.dob);
  console.log('new dob', dob);
  var race_ethnicity = client.race_ethnicity;
  var street = client.street;
  var city = client.city;
  var state = client.state;
  var zip_code = client.zip_code;
  pool.connect(function(connectionError, db, done) {
    if (connectionError) {
      console.log(connectionError, 'ERROR CONNECTING TO DATABASE');
      res.sendStatus(500);
    } else {
      db.query('UPDATE "clients"' +
      'SET "first" = $1, "last" = $2, "dob" = $3,' +
      '"race_ethnicity_id" = (SELECT "id" FROM "race_ethnicity" WHERE "race_ethnicity" = $4),' +
      '"street" = $5, "city" = $6, "state" = $7, "zip_code" = $8' +
      'WHERE "id" = $9',
      [first, last, dob, race_ethnicity, street, city, state, zip_code, client_id],
      function(queryError, result){
        done();
        if (queryError) {
          console.log(queryError, 'ERROR MAKING QUERY');
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
});

module.exports = {
  router: router,
  postClient: postClient
};
