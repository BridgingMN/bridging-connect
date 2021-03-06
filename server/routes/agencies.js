var express = require('express');
var router = express.Router();
var pool = require('../modules/database.js');

/**
  * @api {get} /agencies Get All Agencies
  * @apiVersion 0.1.0
  * @apiName GetAgencies
  * @apiGroup Agencies
  * @apiDescription Retrieves all agencies high-level information from the "agencies" table of the database.
  *
  * @apiSuccess {Number} id Unique ID of the agency.
  * @apiSuccess {String} name Name of the agency.
  * @apiSuccess {Number} bridging_agency_id Agency ID from the Bridging Access Database.
  * @apiSuccess {Boolean} access_disabled Current agency status. True = access disabled.
  * @apiSuccessExample {json} Success-Response:
      HTTP/1.1 200 OK
      [{
        "id": 5,
        "name": "American Indian Family Center",
        "bridging_agency_id": 1505,
        "access_disabled": false
      }]
  * @apiErrorExample {json} Get Error:
  *    HTTP/1.1 500 Internal Server Error
*/
router.get('/', function(req, res) {
  console.log('in agencies get all agencies router');
  if (req.isAuthenticated()) { // user is authenticated
    pool.connect(function(err, database, done) {
      if (err) { // connection error
        console.log('error connecting to the database:', err);
      } else { // we connected
        database.query('SELECT "id", "name", "bridging_agency_id", "access_disabled" FROM "agencies";',
          function(queryErr, result) { // query callback
            done();
            if (queryErr) {
              console.log('error making query:', queryErr);
              res.sendStatus(500);
            } else {
              // console.log('sucessful get from /agencies', result.rows);
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
  * @api {get} /agencies/:agency_id Get One Agency
  * @apiVersion 0.1.0
  * @apiName GetAgency
  * @apiGroup Agencies
  * @apiDescription Retrieve a specific agency's information from the "agencies" table of the database.
  *
  * @apiParam {Number} agency_id Agency's unique ID that is stored in the database.
  *
  * @apiSuccess {Number} id Unique ID of the new agency.
  * @apiSuccess {String} name Name of the agency.
  * @apiSuccess {Number} bridging_agency_id Agency ID from the Bridging Access Database
  * @apiSuccess {String} primary_first First name of agency's primary contact.
  * @apiSuccess {String} primary_last Last name of agency's primary contact.
  * @apiSuccess {String} primary_job_title Job title of agency's primary contact.
  * @apiSuccess {String} primary_department Department of agency's primary contact.
  * @apiSuccess {String} primary_business_phone Business phone number of agency's primary contact.
  * @apiSuccess {String} primary_business_phone_ext Business phone number extension of agency's primary contact.
  * @apiSuccess {String} primary_mobile_phone Mobile phone number of agency's primary contact.
  * @apiSuccess {String} primary_email E-mail address of agency's primary contact.
  * @apiSuccess {Number} beds_allowed_option_id Unique ID corresponding to the "beds_allowed_options" table.
  * @apiSuccess {String} beds_allowed_option String corresponding to the "beds_allowed_option_id" row from the "beds_allowed_options" table.
  * @apiSuccess {Boolean} access_disabled Current agency status. True = access disabled.
  * @apiSuccess {String} notes Any notes the administrator leaves regarding an agency.
  * @apiSuccessExample {json} Success-Response:
      HTTP/1.1 200 OK
      {
        "access_disabled": false,
        "beds_allowed_option": "yes",
        "beds_allowed_option_id": 1,
        "bridging_agency_id": 1504,
        "id": 4,
        "name": "Ain Dah Yung Center",
        "notes": null,
        "primary_business_phone": "(651) 227-4184",
        "primary_business_phone_ext": "12",
        "primary_department": "Children and Families Program",
        "primary_email": "Angela.Gauthier@adycenter.org",
        "primary_first": "Angela",
        "primary_job_title": "Director",
        "primary_last": "Gauthier",
        "primary_mobile_phone": ""
      }
  * @apiErrorExample {json} Get Error:
  *    HTTP/1.1 500 Internal Server Error
*/

router.get('/:agency_id', function(req, res) {
  console.log('in get one agency by id: ', req.params.agency_id);
  if (req.isAuthenticated()) { // user is authenticated
    var agency_id = req.params.agency_id;
    pool.connect(function(err, database, done) {
      if (err) { // connection error
        console.log('error connecting to the database:', err);
        res.sendStatus(500);
      } else { // we connected
        database.query('SELECT "agencies"."id", "agencies"."name", "agencies"."bridging_agency_id", "agencies"."primary_first", "agencies"."primary_last", "agencies"."primary_job_title", "agencies"."primary_department", "agencies"."primary_business_phone", "agencies"."primary_business_phone_ext", "agencies"."primary_mobile_phone", "agencies"."primary_email", "agencies"."beds_allowed_option_id", "beds_allowed_options"."beds_allowed_option", "agencies"."access_disabled", "agencies"."notes" ' +
                        'FROM "agencies" ' +
                        'JOIN "beds_allowed_options" ON "beds_allowed_options"."id" = "agencies"."beds_allowed_option_id" ' +
                        'WHERE "agencies"."id" = $1;',
                       [agency_id],
          function(queryErr, result) { // query callback
            done(); // release connection to the pool
            if (queryErr) {
              console.log('error making query on /agencies/:agency_id GET', queryErr);
              res.sendStatus(500);
            } else {
              console.log('successful get from /agencies/:agency_id', result.rows);
              res.send(result.rows[0]);
            }
          }); // end query callback
        } // end if-else
      }); // end pool.connect
  } else { // user not authenticated
    res.sendStatus(401);
  }
});

/**
  * @api {post} /agencies Add a New Agency
  * @apiVersion 0.1.0
  * @apiName PostAgency
  * @apiGroup Agencies
  * @apiDescription Adds a new agency's information to the "agencies" table in the database.
  *
  * @apiParam {String} name Mandatory Name of the new agency.
  * @apiParam {Number} bridging_agency_id Mandatory Agency ID from the Bridging Access Database
  * @apiParam {String} primary_first Optional First name of new agency's primary contact.
  * @apiParam {String} primary_last Optional Last name of new agency's primary contact.
  * @apiParam {String} primary_job_title Optional Job title of agency's primary contact.
  * @apiParam {String} primary_department Optional Department of agency's primary contact.
  * @apiParam {String} primary_business_phone Optional Business phone number of new agency's primary contact.
  * @apiParam {String} primary_business_phone_ext Optional Business phone number extension of new agency's primary contact.
  * @apiParam {String} primary_mobile_phone Optional Mobile phone number of new agency's primary contact.
  * @apiParam {String} primary_email Optional E-mail address of new agency's primary contact.
  * @apiParam {Boolean} access_disabled Mandatory Current agency status. True = access disabled.
  * @apiParam {String} notes Optional Any notes the administrator wants to keep regarding a particular agency.
  * @apiParam {String} beds_allowed_option Mandatory String corresponding to an entry the "beds_allowed_options" table.
  *
  * @apiSuccess {Number} id Unique ID of the new agency.
  *
  * @apiErrorExample {json} Post Error:
  *    HTTP/1.1 500 Internal Server Error
*/
router.post('/', function(req, res) {
  // if (req.isAuthenticated()) { // user is authenticated
    console.log('POSTING...', req.body);
    var name = req.body.name;
    var bridging_agency_id = req.body.bridging_agency_id;
    var primary_first = req.body.primary_first || null;
    var primary_last = req.body.primary_last || null;
    var primary_job_title = req.body.primary_job_title || null;
    var primary_department = req.body.primary_department || null;
    var primary_business_phone = req.body.primary_business_phone || null;
    var primary_business_phone_ext = req.body.primary_business_phone_ext || null;
    var primary_mobile_phone = req.body.primary_mobile_phone || null;
    var primary_email = req.body.primary_email || null;
    var access_disabled = req.body.access_disabled || false;
    var notes = req.body.notes || null;
    var beds_allowed_option = req.body.beds_allowed_option || 'yes';
    pool.connect(function(err, database, done) {
      if (err) { // connection error
        console.log('error connecting to the database:', err);
        res.sendStatus(500);
      } else { // we connected
        database.query('INSERT INTO "agencies" ("name", "bridging_agency_id", "primary_first", "primary_last", "primary_job_title", "primary_department", "primary_business_phone", "primary_business_phone_ext", "primary_mobile_phone", "primary_email", "access_disabled", "notes", "beds_allowed_option_id") ' +
                        'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, ' +
                        '(SELECT "id" FROM "beds_allowed_options" WHERE "beds_allowed_option" = $13)) ' +
                        'RETURNING "id";',
                       [name, bridging_agency_id, primary_first, primary_last, primary_job_title, primary_department, primary_business_phone, primary_business_phone_ext, primary_mobile_phone, primary_email, access_disabled, notes, beds_allowed_option],
        function(queryErr, result) { // query callback
            done(); // release connection to the pool
            if (queryErr) {
              console.log('error making query on /agencies POST', queryErr);
              res.sendStatus(500);
            } else {
              console.log('successful insert into "agencies"', result);
              res.send(result.rows);
            }
        }); // end query
      } // end if-else
    }); // end pool.connect
  // } else { // user NOT authenticated
    // res.sendStatus(401);
  // }
});

/**
  * @api {put} /agencies/:agency_id Update Agency
  * @apiVersion 0.1.0
  * @apiName UpdateAgency
  * @apiGroup Agencies
  * @apiDescription Updates specified properties for an agency.
  *
  * @apiParam {Number} agency_id Mandatory Unique ID of the new agency.
  * @apiParam {String} name Mandatory Name of the agency.
  * @apiParam {Number} bridging_agency_id Agency ID from the Bridging Access Database
  * @apiParam {String} primary_first First name of agency's primary contact.
  * @apiParam {String} primary_last Last name of agency's primary contact.
  * @apiParam {String} primary_job_title Job title of agency's primary contact.
  * @apiParam {String} primary_department Department of agency's primary contact.
  * @apiParam {String} primary_business_phone Business phone number of agency's primary contact.
  * @apiParam {String} primary_business_phone_ext Business phone number extension of agency's primary contact.
  * @apiParam {String} primary_mobile_phone Mobile phone number of agency's primary contact.
  * @apiParam {String} primary_email E-mail address of agency's primary contact.
  * @apiParam {Boolean} access_disabled Mandatory Current agency status. True = access disabled.
  * @apiParam {String} notes Optional Any notes the administrator wants to keep regarding this particular agency.
  * @apiParam {String} beds_allowed_option Mandatory String corresponding to the "beds_allowed_options" table.
  *
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  * @apiErrorExample Update Error:
  *    HTTP/1.1 500 Internal Server Error
*/
router.put('/', function(req, res) {
  console.log(req.body);
  if (req.isAuthenticated()) { // user is authenticated
    var agency_id = req.body.id;
    // req.body variables
    var name = req.body.name;
    var bridging_agency_id = req.body.bridging_agency_id;
    var primary_first = req.body.primary_first || null;
    var primary_last = req.body.primary_last || null;
    var primary_job_title = req.body.primary_job_title || null;
    var primary_department = req.body.primary_department || null;
    var primary_business_phone = req.body.primary_business_phone || null;
    var primary_business_phone_ext = req.body.primary_business_phone_ext || null;
    var primary_mobile_phone = req.body.primary_mobile_phone || null;
    var primary_email = req.body.primary_email;
    var access_disabled = req.body.access_disabled || false;
    var notes = req.body.notes || null;
    var beds_allowed_option = req.body.beds_allowed_option || 'yes';
    pool.connect(function(err, database, done) {
      if (err) { // connection error
        console.log('error connecting to the database:', err);
        res.sendStatus(500);
      } else { // we connected
        database.query('UPDATE "agencies"' +
                        'SET ("name", "bridging_agency_id", "primary_first", "primary_last", "primary_job_title", "primary_department", "primary_business_phone", "primary_business_phone_ext", "primary_mobile_phone", "primary_email", "access_disabled", "notes", "beds_allowed_option_id") = ' +
                        '($2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, (SELECT "id" FROM "beds_allowed_options" WHERE "beds_allowed_option" = $14)) ' +
                        'WHERE "id" = $1;',
                        [agency_id, name, bridging_agency_id, primary_first, primary_last, primary_job_title, primary_department, primary_business_phone, primary_business_phone_ext, primary_mobile_phone, primary_email, access_disabled, notes, beds_allowed_option],
          function(queryErr, result) { // query callback
            done(); // release connection to the pool
            if (queryErr) {
              console.log('error making query on /agency/:agency PUT', queryErr);
              res.sendStatus(500);
            } else {
              console.log('successful update in "agencies"', result);
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
  * @api {delete} /agencies/:agency_id Delete Agency
  * @apiVersion 0.1.0
  * @apiName DeleteAgency
  * @apiGroup Agencies
  * @apiDescription Deletes specified agency from the database.
  *
  * @apiParam {Number} agency_id Unique ID of the agency in the "agencies" table.
  *
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  * @apiErrorExample Delete Error:
  *    HTTP/1.1 500 Internal Server Error
*/
router.delete('/:agency_id', function(req, res) {
  if (req.isAuthenticated()) { // user is authenticated
    var agency_id = req.params.agency_id;
    pool.connect(function(err, database, done) {
      if (err) { // connection error
        console.log('error connecting to the database:', err);
      } else { // we connected
        database.query('DELETE FROM "agencies" WHERE "id" = $1;', [agency_id],
          function(queryErr, result) { // query callback
            done();
            if (queryErr) {
              console.log('error making query:', queryErr);
              res.sendStatus(500);
            } else {
              console.log('sucessful deletion from /agencies/:agency_id', result);
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
