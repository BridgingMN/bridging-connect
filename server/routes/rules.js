var express = require('express');
var router = express.Router();

var pool = require('../modules/database.js');

/**
  * @api {get} /rules/zip/:zip_code Get locations for ZIP code
  * @apiVersion 0.1.0
  * @apiName GetZipLocation
  * @apiGroup Rules
  * @apiDescription Determines which location(s) should be available to a user
  *    given the client's ZIP code
  *
  * @apiParam {String} zip_code   ZIP code of client seeking appointment
  * @apiSuccess {Object[]} locations   Array of location objects representing
  *    the Bridging locations at which the user is permitted make an appointment
  * @apiSuccess {Object} locations.location   Object containing the location's name and address
  * @apiSuccess {String} locations.location.name   Name of location ("Bloomington
  *    or Roseville")
  * @apiSuccess {Number} locations.location.id   Unique ID of location
  * @apiSuccess {String} locations.location.street   Street address of location
  * @apiSuccess {String} locations.location.city   City for address of location
  * @apiSuccess {String} locations.location.state   State address of location (2-letter abbreviation)
  * @apiSuccessExample {json} Success-Response:
  *    HTTP/1.1 200 OK
  *    [
  *      {
  *
  *        "location": {
              "name": "Roseville",
              "id": 1,
              "street": "1730 Terrace Dr",
              "city": "Roseville",
              "state": "MN",
            }
  *      }
  *    ]
  * @apiErrorExample {json} List error
  *    HTTP/1.1 500 Internal Server Error
*/
router.get('/zip/:zip_code', function(req, res) {
  var zip_code = req.params.zip_code.toString();
  console.log(zip_code);

  getLocationForZip(zip_code)
  .then(function(result, error) {
    if (error) {
      console.log(error);
      res.sendStatus(500);
    } else {
      res.send(result);
    }
  });
});

function getLocationForZip(zip_code) {

  return pool.connect().then(function(client) {
    return client.query('SELECT "locations"."location", "locations"."id", "locations"."street", "locations"."city", "locations"."state" ' +
    'FROM "locations" JOIN "zip_codes" ON "locations"."id" = "zip_codes"."location_id" ' +
    'WHERE "zip_codes"."zip_code" = $1',
    [zip_code])

    .then(function(result) {
      client.release();
      return result.rows;
    })

    .catch(function(error) {
      client.release();
      console.error('query error', error.message, error.stack);
      return error;
    });
  });
}

module.exports = router;
