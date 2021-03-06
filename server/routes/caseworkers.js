var express = require('express');
var router = express.Router();
var pool = require('../modules/database.js');
var tokens = require('../modules/tokens.js');
var mail = require('../modules/mail.js');
var formatters = require('../modules/formatters.js');
var formatDateForPostgres = formatters.formatDateForPostgres;
var usernameToLowerCase = require('../modules/authentication').usernameToLowerCase;

/**
  * @api {get} /caseworkers Get All Caseworkers
  * @apiVersion 0.1.0
  * @apiName GetCaseworkers
  * @apiGroup Caseworkers
  * @apiDescription Retrieves all caseworkers' high-level information from the database.
  *
  * @apiSuccess {String} first First name of the caseworker from the "users" table.
  * @apiSuccess {String} last Last name of the caseworker from the "users" table.
  * @apiSuccess {String} name Name of the agency from the "agencies" table.
  * @apiSuccess {Number} agency_id Unique ID of the agency a caseworker is associated with.
  * @apiSuccess {Number} user_id Unique ID of the caseworker
  * @apiSuccess {Number} bridging_agency_id Agency ID from the Bridging Access Database - stored in the "agencies" table.
  * @apiSuccess {Boolean} agency_access_disabled Current agency status. True = access disabled. - from the "agencies" table.
  * @apiSuccess {Boolean} user_access_disabled Current caseworker status. True = access disabled. - from the "caseworkers" table.
  * @apiSuccessExample {json} Success-Response:
      HTTP/1.1 200 OK
      [
        {
          "user_id": 1235,
          "first": "Angil",
          "last": "McCaughen",
          "agency_id": 10,
          "name": "Anoka Hennepin District 11 - HOPE Office",
          "bridging_agency_id": 1510,
          "agency_access_disabled": false,
          "user_access_disabled": false
          }
      ]
  * @apiErrorExample {json} Get Error:
  *    HTTP/1.1 500 Internal Server Error
*/
router.get('/', function(req, res) {
  if (req.isAuthenticated()) { // user is authenticated
    var user_type = 'caseworker';
    pool.connect(function(err, database, done) {
      if (err) { // connection error
        console.log('error connecting to the database:', err);
      } else { // we connected
        database.query('SELECT "users"."id" AS "user_id", "users"."first", "users"."last", "agencies"."id" AS "agency_id", "agencies"."name", "agencies"."bridging_agency_id", "agencies"."access_disabled" AS "agency_access_disabled", "users"."access_disabled" AS "user_access_disabled" ' +
                        'FROM "users" JOIN "agencies" ON "users"."agency_id" = "agencies"."id"' +
                        'WHERE "users"."user_type_id" = (SELECT "id" FROM "user_types" WHERE "user_type" = $1);',
                        [user_type],
          function(queryErr, result) { // query callback
            done();
            if (queryErr) {
              console.log('error making query:', queryErr);
              res.sendStatus(500);
            } else {
              console.log('sucessful get from /caseworkers', result.rows);
              res.send(result.rows);
            }
        }); // end query callback
      } // end DB connection if-else
    }); // end pool.connect
  } else { // user not authenticated
    res.sendStatus(401);
  }
});

/**
  * @api {get} /caseworkers/:caseworker_id Get One Caseworker
  * @apiVersion 0.1.0
  * @apiName GetCaseworker
  * @apiGroup Caseworkers
  * @apiDescription Retrieve a specific caseworker's information from the database.
  *
  * @apiParam {Number} caseworker_id Caseworker's unique ID that is stored in the database.
  *
  * @apiSuccess {Number} user_id Unique ID of the caseworker
  * @apiSuccess {String} first First name of the caseworker from the "users" table.
  * @apiSuccess {String} last Last name of the caseworker from the "users" table.
  * @apiSuccess {String} department Department of caseworker within agency.
  * @apiSuccess {String} day_phone Daytime phone number of the caseworker from the "users" table.
  * @apiSuccess {String} ext Phone number extension of caseworker from the "users" table.
  * @apiSuccess {String} email Email address of caseworker from the "users" table.
  * @apiSuccess {String} name Name of the agency from the "agencies" table.
  * @apiSuccess {Number} agency_id Unique ID of the agency a caseworker is associated with.
  * @apiSuccess {Number} bridging_agency_id Agency ID from the Bridging Access Database - stored in the "agencies" table.
  * @apiSuccess {String} primary_first First name of agency's primary contact from the "agencies" table.
  * @apiSuccess {String} primary_last Last name of agency's primary contact from the "agencies" table.
  * @apiSuccess {String} primary_business_phone Business phone number of agency's primary contact from the "agencies" table.
  * @apiSuccess {String} primary_business_phone_ext Business phone number extension of agency's primary contact from the "agencies" table.
  * @apiSuccess {String} primary_mobile_phone Mobile phone number of agency's primary contact from the "agencies" table.
  * @apiSuccess {String} primary_email E-mail address of agency's primary contact from the "agencies" table.
  * @apiSuccess {String} notes Any notes the administrator leaves regarding a caseworker.
  * @apiSuccess {Boolean} agency_access_disabled Current agency status. True = access disabled. - from the "agencies" table.
  * @apiSuccess {Boolean} user_access_disabled Current caseworker status. True = access disabled. - from the "users" table.
  * @apiSuccessExample {json} Success-Response:
      HTTP/1.1 200 OK
      {
        "user_id": 120,
        "department": null,
        "first": "Maison",
        "last": "Diver",
        "day_phone": "1-(347)477-7769",
        "ext": null,
        "email": "mdiver38@alibaba.com",
        "notes": null,
        "agency_id": 70,
        "name": "Minnesota Council of Churches Refugee Services",
        "bridging_agency_id": 1580,
        "primary_first": "Ben",
        "primary_last": "Walen",
        "primary_business_phone": "(612) 230-3215",
        "primary_business_phone_ext": "",
        "primary_mobile_phone": "",
        "primary_email": "ben.walen@mnchurches.org",
        "agency_access_disabled": false,
        "user_access_disabled": false
      }
  * @apiErrorExample {json} Get Error:
  *    HTTP/1.1 500 Internal Server Error
*/
router.get('/:caseworker_id', function(req, res) {
  if (req.isAuthenticated()) { // user is authenticated
    var caseworker_id = req.params.caseworker_id;
    pool.connect(function(err, database, done) {
      if (err) { // connection error
        console.log('error connecting to the database:', err);
      } else { // we connected
        database.query('SELECT "users"."id" AS "user_id", "users"."department", "users"."first", "users"."last", "users"."day_phone", "users"."ext", "users"."email", "users"."notes", "agencies"."id" AS "agency_id", "agencies"."name", "agencies"."bridging_agency_id", "agencies"."primary_first", "agencies"."primary_last", "agencies"."primary_business_phone", "agencies"."primary_business_phone_ext", "agencies"."primary_mobile_phone", "agencies"."primary_email", "users"."notes", "agencies"."access_disabled" AS "agency_access_disabled", "users"."access_disabled" AS "user_access_disabled" ' +
                        'FROM "users" JOIN "agencies" ON "users"."agency_id" = "agencies"."id" ' +
                        'WHERE "users"."id" = $1;', [caseworker_id],
          function(queryErr, result) { // query callback
            done();
            if (queryErr) {
              console.log('error making query:', queryErr);
              res.sendStatus(500);
            } else {
              console.log('sucessful get from /caseworkers/:caseworker_id', result.rows);
              res.send(result.rows);
            }
        }); // end query callback
      } // end DB connection if-else
    }); // end pool.connect
  } else { // user not authenticated
    res.sendStatus(401);
  }
});

/**
  * @api {post} /caseworkers Add a New Caseworker
  * @apiVersion 0.1.0
  * @apiName PostCaseworker
  * @apiGroup Caseworkers
  * @apiDescription Adds a new caseworker's information to the "users" table in the database.
  *
  * @apiParam {Number} agency_id Mandatory Unique ID of the agency the caseworker is associated with.
  * @apiParam {String} first First name of the caseworker from the "users" table.
  * @apiParam {String} last Last name of the caseworker from the "users" table.
  * @apiParam {String} day_phone Daytime phone number of the caseworker from the "users" table.
  * @apiParam {String} ext Phone number extension of caseworker from the "users" table.
  * @apiParam {String} email Mandatory Email address of caseworker from the "users" table.
  * @apiParam {Boolean} access_disabled Mandatory Current caseworker status. True = access disabled.
  * @apiParam {String} notes Any notes the administrator leaves regarding a caseworker.
  * @apiParam {String} user_type Mandatory Indicator for the type of user being created. Corresponds to an entry in the "user_types" table.
  *
  * @apiSuccess {Number} id Unique ID of the new caseworker.
  *
  * @apiErrorExample {json} Post Error:
  *    HTTP/1.1 500 Internal Server Error
*/
router.post('/', usernameToLowerCase, function(req, res) {
  if (req.isAuthenticated()) { // user is authenticated
    var agency_id = req.body.agency_id;
    var first = req.body.first;
    var last = req.body.last;
    var day_phone = req.body.day_phone || null;
    var ext = req.body.ext || null;
    var email = req.body.email;
    var access_disabled = req.body.access_disabled || false;
    var notes = req.body.notes || null;
    var user_type = req.body.user_type || 'caseworker';
    var token = tokens.generateToken();
    var token_expiration = tokens.generateExpirationDate(15);
    pool.connect(function(err, database, done) {
      if (err) { // connection error
        console.log('error connecting to the database:', err);
        res.sendStatus(500);
      } else { // we connected
        database.query('INSERT INTO "users" ("agency_id", "first", "last", "day_phone", "ext", "email", "access_disabled", "notes", "user_type_id", "token", "token_expiration") ' +
                        'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, ' +
                        '(SELECT "id" FROM "user_types" WHERE "user_type" = $9), $10, $11) ' +
                        'RETURNING "id", "first", "last", "day_phone", "ext", "email", "access_disabled";',
                        [agency_id, first, last, day_phone, ext, email, access_disabled, notes, user_type, token, formatDateForPostgres(token_expiration)],
          function(queryErr, result) { // query callback
            done(); // release connection to the pool
            if (queryErr) {
              console.log('error making query on /caseworkers POST', queryErr);
              res.sendStatus(500);
            } else {
              console.log('successful insert into "caseworkers"', result);
              mail.invite(result.rows[0], token, token_expiration);
              res.send(result.rows[0]);
            }
        }); // end query
      } // end if-else
    }); // end pool.connect
  } else { // user NOT authenticated
    res.sendStatus(401);
  }
});

/**
  * @api {put} /caseworker/:caseworker_id Update Caseworker
  * @apiVersion 0.1.0
  * @apiName UpdateCaseworker
  * @apiGroup Caseworkers
  * @apiDescription Updates specified properties for a caseworker.
  *
  * @apiParam {Number} user_id Unique ID of the caseworker.
  * @apiParam {Number} agency_id Unique ID of the agency the caseworker is associated with.
  * @apiParam {String} first First name of the caseworker.
  * @apiParam {String} last Last name of the caseworker.
  * @apiParam {String} day_phone Daytime phone number of the caseworker.
  * @apiParam {String} ext Phone number extension of caseworker.
  * @apiParam {String} email Email address of caseworker from the "users" table.
  * @apiParam {Boolean} access_disabled Current caseworker status. True = access disabled.
  * @apiParam {String} notes Any notes the administrator leaves regarding a caseworker.
  * @apiParam {String} user_type Optional indicator for the type of user being created. Corresponds to an entry in the "user_types" table. Will default to "caseworker".
  *
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  * @apiErrorExample Update Error:
  *    HTTP/1.1 500 Internal Server Error
*/
router.put('/', usernameToLowerCase, function(req, res) {
  console.log(req.body);
  if (req.isAuthenticated()) { // user is authenticated
    var user_id = req.body.user_id;
    var agency_id = req.body.agency_id;
    var first = req.body.first;
    var last = req.body.last;
    var day_phone = req.body.day_phone || null;
    var ext = req.body.ext || null;
    var email = req.body.email;
    var user_access_disabled = req.body.user_access_disabled || false;
    var notes = req.body.notes || null;
    var user_type = req.body.user_type || 'caseworker';
    pool.connect(function(err, database, done) {
      if (err) { // connection error
        console.log('error connecting to the database:', err);
        res.sendStatus(500);
      } else { // we connected
        database.query('UPDATE "users" ' +
                        'SET ("agency_id", "first", "last", "day_phone", "ext", "email", "access_disabled", "notes", "user_type_id") = ' +
                        '($1, $2, $3, $4, $5, $6, $7, $8, (SELECT "id" FROM "user_types" WHERE "user_type" = $9)) ' +
                        'WHERE "id" = $10;',
                        [agency_id, first, last, day_phone, ext, email, user_access_disabled, notes, user_type, user_id],
          function(queryErr, result) { // query callback
            done(); // release connection to the pool
            if (queryErr) {
              console.log('error making query on /caseworkers/:caseworker_id PUT', queryErr);
              res.sendStatus(500);
            } else {
              console.log('successful update in "caseworkers"', result);
              res.sendStatus(200);
            }
        }); // end query
      } // end if-else
    }); // end pool.connect
  } else { // user NOT authenticated
    res.sendStatus(401);
  }
});

/**
  * @api {delete} /caseworkers/:caseworker_id Delete Caseworker
  * @apiVersion 0.1.0
  * @apiName DeleteCaseworker
  * @apiGroup Caseworkers
  * @apiDescription Deletes specified caseworker from the database.
  *
  * @apiParam {Number} caseworker_id Unique ID of the caseworker in the "users" table.
  *
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  * @apiErrorExample Delete Error:
  *    HTTP/1.1 500 Internal Server Error
*/
router.delete('/:caseworker_id', function(req, res) {
  if (req.isAuthenticated()) { // user is authenticated
    var caseworker_id = req.params.caseworker_id;
    pool.connect(function(err, database, done) {
      if (err) { // connection error
        console.log('error connecting to the database:', err);
      } else { // we connected
        database.query('DELETE FROM "users" WHERE "id" = $1;', [caseworker_id],
          function(queryErr, result) { // query callback
            done();
            if (queryErr) {
              console.log('error making query:', queryErr);
              res.sendStatus(500);
            } else {
              console.log('sucessful deletion from /caseworkers/:caseworker_id', result);
              res.sendStatus(200);
            }
        }); // end query callback
      } // end DB connection if-else
    }); // end pool.connect
  } else { // user not authenticated
    res.sendStatus(401);
  }
});

module.exports = router;
