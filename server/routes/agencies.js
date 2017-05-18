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
  *
  * @apiErrorExample {json} Get Error:
  *    HTTP/1.1 500 Internal Server Error
*/
router.get('/', function(req, res) {
  if (req.isAuthenticated()) { // user is authenticated
    pool.connect(function(err, database, done) {
      if (err) { // connection error
        console.log('error connecting to the database:', err);
      } else { // we connected
        database.query('SELECT * FROM "agencies"',
          function(queryErr, result) { // query callback
            done();
            if (queryErr) {
              console.log('error making query:', queryErr);
              res.sendStatus(500);
            } else {
              console.log('sucessful get from /agencies', result);
              res.send(result);
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
  * @apiSuccess {String} beds_allowed_option String corresponding to an entry in the "beds_allowed_options" table.
  * @apiSuccess {Boolean} access_disabled Current agency status. True = access disabled.
  *
  * @apiErrorExample {json} Get Error:
  *    HTTP/1.1 500 Internal Server Error
*/
router.get('/:agency_id', function(req, res) {
  if (req.isAuthenticated()) { // user is authenticated
    var agency_id = req.params.agency_id;
    pool.connect(function(err, database, done) {
      if (err) { // connection error
        console.log('error connecting to the database:', err);
        res.sendStatus(500);
      } else { // we connected
        database.query('SELECT * FROM "agencies" WHERE "id" = $1;', [agency_id],
          function(queryErr, result) { // query callback
            done(); // release connection to the pool
            if (queryErr) {
              console.log('error making query on /agencies/:agency_id GET', queryErr);
              res.sendStatus(500);
            } else {
              console.log('successful get from /agencies/:agency_id', result);
              res.send(result);
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
  * @apiParam {String} beds_allowed_option Mandatory String corresponding to an entry the "beds_allowed_options" table.
  * @apiParam {Boolean} access_disabled Mandatory Current agency status. True = access disabled.
  *
  * @apiSuccess {Number} id Unique ID of the new agency.
  *
  * @apiErrorExample {json} Post Error:
  *    HTTP/1.1 500 Internal Server Error
*/
router.post('/', function(req, res) {
  // if (req.isAuthenticated()) { // user is authenticated
    var name = req.body.name;
    var bridging_agency_id = req.body.bridging_agency_id;
    var primary_first = req.body.primary_first;
    var primary_last = req.body.primary_last;
    var primary_job_title = req.body.primary_job_title;
    var primary_department = req.body.primary_department;
    var primary_business_phone = req.body.primary_business_phone;
    var primary_business_phone_ext = req.body.primary_business_phone_ext;
    var primary_mobile_phone = req.body.primary_mobile_phone;
    var primary_email = req.body.primary_email;
    var beds_allowed_option = req.body.beds_allowed_option;
    var access_disabled = req.body.access_disabled;
    pool.connect(function(err, database, done) {
      if (err) { // connection error
        console.log('error connecting to the database:', err);
        res.sendStatus(500);
      } else { // we connected
        database.query('INSERT INTO "agencies" ("name", "bridging_agency_id", \
        "primary_first", "primary_last", "primary_job_title", "primary_department", \
        "primary_business_phone", "primary_business_phone_ext", "primary_mobile_phone", \
         "primary_email", "beds_allowed_option_id", "access_disabled") \
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, \
        (SELECT "id" FROM "beds_allowed_options" WHERE "beds_allowed_option" = $11), $12)',
        [name, bridging_agency_id, primary_first, primary_last, primary_job_title,
        primary_department, primary_business_phone, primary_business_phone_ext,
        primary_mobile_phone, primary_email, beds_allowed_option, access_disabled],
        function(queryErr, result) { // query callback
            done(); // release connection to the pool
            if (queryErr) {
              console.log('error making query on /agencies POST', queryErr);
              res.sendStatus(500);
            } else {
              console.log('successful insert into "agencies"', result);
              res.send(result);
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
  * @apiParam {String} name Mandatory Name of the agency.
  * @apiParam {Number} agency_id Mandatory Unique ID of the new agency.
  * @apiParam {Number} bridging_agency_id Agency ID from the Bridging Access Database
  * @apiParam {String} primary_first First name of agency's primary contact.
  * @apiParam {String} primary_last Last name of agency's primary contact.
  * @apiParam {String} primary_job_title Job title of agency's primary contact.
  * @apiParam {String} primary_department Department of agency's primary contact.
  * @apiParam {String} primary_business_phone Business phone number of agency's primary contact.
  * @apiParam {String} primary_business_phone_ext Business phone number extension of agency's primary contact.
  * @apiParam {String} primary_mobile_phone Mobile phone number of agency's primary contact.
  * @apiParam {String} primary_email E-mail address of agency's primary contact.
  * @apiParam {String} beds_allowed_option Mandatory String corresponding to the "beds_allowed_options" table.
  * @apiParam {Boolean} access_disabled Mandatory Current agency status. True = access disabled.
  *
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  * @apiErrorExample Update Error:
  *    HTTP/1.1 500 Internal Server Error
*/
router.put('/:agency_id', function(req, res) {

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

});

module.exports = router;
