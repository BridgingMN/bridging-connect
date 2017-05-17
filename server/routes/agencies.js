var express = require('express');
var router = express.Router();

/**
  * @api {get} /agencies Get All Agencies
  * @apiVersion 0.1.0
  * @apiName GetAgencies
  * @apiGroup Agencies
  * @apiDescription Retrieves all agencies high-leavel information from the "agencies" table of the database.

  * @apiSuccess {String} name Name of the agency.
  * @apiSuccess {Number} bridging_agency_id Agency ID from the Bridging Access Database.
  * @apiSuccess {Boolean} access_disabled Current agency status. True = access disabled.

  * @apiErrorExample {json} Get Error:
  *    HTTP/1.1 500 Internal Server Error
*/
router.get('/', function(req, res) {

});

/**
  * @api {get} /agencies/:agency_id Get One Agency
  * @apiVersion 0.1.0
  * @apiName GetAgency
  * @apiGroup Agencies
  * @apiDescription Retrieve a specific agency's information from the "agencies" table of the database.

  * @apiParam {Number} agency_id Agency's unique ID that is stored in the database.

  * @apiSuccess {String} name Name of the agency.
  * @apiSuccess {Number} bridging_agency_id Agency ID from the Bridging Access Database
  * @apiSuccess {String} primary_first First name of agency's primary contact.
  * @apiSuccess {String} primary_last Last name of agency's primary contact.
  * @apiSuccess {String} primary_business_phone Business phone number of agency's primary contact.
  * @apiSuccess {String} primary_business_phone_ext Business phone number extension of agency's primary contact.
  * @apiSuccess {String} primary_mobile_phone Mobile phone number of agency's primary contact.
  * @apiSuccess {String} primary_email E-mail address of agency's primary contact.
  * @apiSuccess {Number} beds_allowed_option_id Number corresponding to the "beds_allowed_options" table.
  * @apiSuccess {Boolean} access_disabled Current agency status. True = access disabled.

  * @apiErrorExample {json} Get Error:
  *    HTTP/1.1 500 Internal Server Error
*/
router.get('/:agency_id', function(req, res) {

});

/**
  * @api {post} /agencies Add a New Agency
  * @apiVersion 0.1.0
  * @apiName PostAgency
  * @apiGroup Agencies
  * @apiDescription Adds a new agency's information to the "agencies" table in the database.

  * @apiParam {String} name Mandatory Name of the new agency.
  * @apiParam {Number} bridging_agency_id Mandatory Agency ID from the Bridging Access Database
  * @apiParam {String} primary_first Optional First name of new agency's primary contact.
  * @apiParam {String} primary_last Optional Last name of new agency's primary contact.
  * @apiParam {String} primary_business_phone Optional Business phone number of new agency's primary contact.
  * @apiParam {String} primary_business_phone_ext Optional Business phone number extension of new agency's primary contact.
  * @apiParam {String} primary_mobile_phone Optional Mobile phone number of new agency's primary contact.
  * @apiParam {String} primary_email Optional E-mail address of new agency's primary contact.
  * @apiParam {Number} beds_allowed_option_id Mandatory Number corresponding to the "beds_allowed_options" table.
  * @apiParam {Boolean} access_disabled Mandatory Current agency status. True = access disabled.

  * @apiSuccess {Number} agency_id Unique ID of the new agency.

  * @apiErrorExample {json} Post Error:
  *    HTTP/1.1 500 Internal Server Error
*/
router.post('/', function(req, res) {

});

/**
  * @api {put} /agencies/:agency_id Update Agency
  * @apiVersion 0.1.0
  * @apiName UpdateAgency
  * @apiGroup Agencies
  * @apiDescription Updates specified properties for an agency.
  *
  * @apiParam {String} name Name of the agency.
  * @apiParam {Number} bridging_agency_id Agency ID from the Bridging Access Database
  * @apiParam {String} primary_first First name of agency's primary contact.
  * @apiParam {String} primary_last Last name of agency's primary contact.
  * @apiParam {String} primary_business_phone Business phone number of agency's primary contact.
  * @apiParam {String} primary_business_phone_ext Business phone number extension of agency's primary contact.
  * @apiParam {String} primary_mobile_phone Mobile phone number of agency's primary contact.
  * @apiParam {String} primary_email E-mail address of agency's primary contact.
  * @apiParam {Number} beds_allowed_option_id Number corresponding to the "beds_allowed_options" table.
  * @apiParam {Boolean} access_disabled Current agency status. True = access disabled.
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
  * @apiParam {Number} agency_id Unique ID of the new agency.
  *
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  * @apiErrorExample Delete Error:
  *    HTTP/1.1 500 Internal Server Error
*/
router.delete('/:agency_id', function(req, res) {

});

module.exports = router;