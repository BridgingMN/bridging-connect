var express = require('express');
var router = express.Router();

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
    var first = client.first;
    var last = client.last;
    var dob = client.dob;
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
        db.query('INSERT INTO "clients" ("first", "last", "dob", "race_ethnicity_id", "street", "city", "state", "zip_code") ' +
        'VALUES ($1, $2, $3, ' +
        '(SELECT "id" FROM "race_ethnicity" WHERE "race_ethnicity" = $4),' +
        '$5, $6, $7, $8) RETURNING "id"',
        [first, last, dob, race_ethnicity, street, city, state, zip_code],
        function(queryError, result){
          done();
          if (queryError) {
            console.log('ERROR MAKING QUERY');
            res.sendStatus(500);
          } else {
            res.send(result.rows[0]);
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
  var client_id = client.client_id;
  var first = client.first;
  var last = client.last;
  var dob = client.dob;
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
      db.query('UPDATE "clients" SET ("first", "last", "dob", "race_ethnicity_id", "street", "city", "state", "zip_code") ' +
      'VALUES ($1, $2, $3, ' +
      '(SELECT "id" FROM "race_ethnicity" WHERE "race_ethnicity" = $4),' +
      '$5, $6, $7, $8) RETURNING "id"',
      [first, last, dob, race_ethnicity, street, city, state, zip_code],
      function(queryError, result){
        done();
        if (queryError) {
          console.log('ERROR MAKING QUERY');
          res.sendStatus(500);
        } else {
          res.send(result.rows[0]);
        }
      });
    }
  });
}

});

module.exports = router;
