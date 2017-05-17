var express = require('express');
var router = express.Router();

/**
  * @api {post} /clients Add a client
  * @apiVersion 0.1.1
  * @apiName PostClient
  * @apiGroup Clients
  * @apiDescription Saves a client's information to database

  * @apiParam {String} first   First name of client
  * @apiParam {String} last   Last name of client
  * @apiParam {Date} dob Client date of birth
  * @apiParam {String} street   Street address of client
  * @apiParam {String} city   City of client address
  * @apiParam {String} state State of client address (2-letter abbreviation)

  * @apiSuccess {Number} client_id   Unique ID of client that has been added
  * @apiErrorExample {json} Post error
  *    HTTP/1.1 500 Internal Server Error
*/
router.post('/', function(req, res) {

});

/**
  * @api {put} /clients/:client_id Update client
  * @apiVersion 0.1.0
  * @apiName UpdateClient
  * @apiGroup Clients
  * @apiDescription Changes specified properties for a client and changes them to new values

  * @apiParam {Object[]} updates   Array of objects with updates to properties of the client
  * @apiParam {Object} updates.update   Update object
  * @apiParam {String} update.key   Property of client to be updated (e.g "first")
  * @apiParam {String} update.value   New value for property (e.g. "Vivian")
  * @apiParamExample {json} Request-Example:
  *     {
  *        updates: [
  *         {
  *           "key": "first",
  *           "value": "Vivian"
  *         },
  *         {
  *           "key": "address",
  *           "value": "1907 Glenwood Dr, Ham Lake, MN"
  *         }
  *       ]
  *     }
  *
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  * @apiErrorExample Not found error
  *    HTTP/1.1 404 Not found
*/
router.put('/:client_id', function(req, res) {

});

module.exports = router;
