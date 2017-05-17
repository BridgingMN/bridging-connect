var express = require('express');
var router = express.Router();
var pool = require('../modules/database.js');

/**
  * @api {get} /caseworkers Get All Caseworkers
  * @apiVersion 0.1.0
  * @apiName GetCaseworkers
  * @apiGroup Caseworkers
  * @apiDescription Retrieves all caseworkers' high-level information from the database.

  * @apiSuccess {String} first First name of the caseworker from the "users" table.
  * @apiSuccess {String} last Last name of the caseworker from the "users" table.
  * @apiSuccess {String} name Name of the agency from the "agencies" table.
  * @apiSuccess {Number} agency_id Unique ID of the agency a caseworker is associated with.
  * @apiSuccess {Number} bridging_agency_id Agency ID from the Bridging Access Database - stored in the "agencies" table.
  * @apiSuccess {Boolean} agency_access_disabled Current agency status. True = access disabled. - from the "agencies" table.
  * @apiSuccess {Boolean} caseworker_access_disabled Current caseworker status. True = access disabled. - from the "caseworkers" table.
  

  * @apiErrorExample {json} Get Error:
  *    HTTP/1.1 500 Internal Server Error
*/
router.get('/', function(req, res) {

});

/**
  * @api {get} /caseworkers/:caseworker_id Get One Caseworker
  * @apiVersion 0.1.0
  * @apiName GetCaseworker
  * @apiGroup Caseworkers
  * @apiDescription Retrieve a specific caseworker's information from the database.

  * @apiParam {Number} caseworker_id Caseworker's unique ID that is stored in the database.

  * @apiSuccess {String} first First name of the caseworker from the "users" table.
  * @apiSuccess {String} last Last name of the caseworker from the "users" table.
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
  * @apiSuccess {Boolean} agency_access_disabled Current agency status. True = access disabled. - from the "agencies" table.
  * @apiSuccess {Boolean} caseworker_access_disabled Current caseworker status. True = access disabled. - from the "caseworkers" table.

  * @apiErrorExample {json} Get Error:
  *    HTTP/1.1 500 Internal Server Error
*/
router.get('/:caseworker_id', function(req, res) {

});

/**
  * @api {post} /caseworkers Add a New Caseworker
  * @apiVersion 0.1.0
  * @apiName PostCaseworker
  * @apiGroup Caseworkers
  * @apiDescription Adds a new caseworker's information to the "users" table in the database.

  * @apiParam {String} user_type Mandatory Indicator for the type of user being created. Corresponds to an entry in the "user_types" table.
  * @apiParam {Number} agency_id Mandatory Unique ID of the agency the caseworker is associated with.
  * @apiParam {String} first First name of the caseworker from the "users" table.
  * @apiParam {String} last Last name of the caseworker from the "users" table.
  * @apiParam {String} day_phone Daytime phone number of the caseworker from the "users" table.
  * @apiParam {String} ext Phone number extension of caseworker from the "users" table.
  * @apiParam {String} email Mandatory Email address of caseworker from the "users" table.
  * @apiParam {Boolean} caseworker_access_disabled Mandatory Current caseworker status. True = access disabled.

  * @apiSuccess {Number} id Unique ID of the new caseworker.

  * @apiErrorExample {json} Post Error:
  *    HTTP/1.1 500 Internal Server Error
*/
router.post('/', function(req, res) {
  if (req.isAuthenticated()) { // user is authenticated
    var user_type = req.body.user_type;
    var agency_id = req.body.agency_id;
    var first = req.body.first;
    var last = req.body.last;
    var day_phone = req.body.day_phone;
    var ext = req.body.ext;
    var email = req.body.email;
    var caseworker_access_disabled = req.body.caseworker_access_disabled;
    pool.connect(function(err, database, done) {
      if (err) { // connection error
        console.log('error connecting to the database:', err);
        res.sendStatus(500);
      } else { // we connected
        database.query('', [user_type, agency_id, first, last, day_phone, ext, email, caseworker_access_disabled],
          function(queryErr, result) { // query callback
            done(); // release connection to the pool
            if (queryErr) {
              console.log('error making query on /caseworkers POST', queryErr);
              res.sendStatus(500);
            } else {
              console.log('successful insert into "caseworkers"', result);
              res.send(result);
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
  * @apiParam {Number} agency_id Unique ID of the agency the caseworker is associated with.
  * @apiParam {String} first First name of the caseworker.
  * @apiParam {String} last Last name of the caseworker.
  * @apiParam {String} day_phone Daytime phone number of the caseworker.
  * @apiParam {String} ext Phone number extension of caseworker.
  * @apiParam {String} email Email address of caseworker from the "users" table.
  * @apiParam {Boolean} caseworker_access_disabled Current caseworker status. True = access disabled.
  *
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  * @apiErrorExample Update Error:
  *    HTTP/1.1 500 Internal Server Error
*/
router.put('/:caseworker_id', function(req, res) {

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

});

module.exports = router;