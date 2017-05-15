var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');

/**
  * @api {get} /appointments/existing/:user_id
  * @apiDescription Get a user's existing appointments
  * @apiGroup Appointments
  * @apiParam {Number} user_id User's unique ID
  * @apiSuccess {Object[]} appointments   Array of appointment objects
  * @apiSuccessExample {json} Success-Response:
      HTTP/1.1 200 OK
      [{
        "id": 1,
        "client": {
          "first": "Jim",
          "last": "Tolliver",
          "address": "1400 Lizard Ln, St. Paul, MN"
        },
        "appointment_info": {
          "start_time": "9:15 am",
          "end_time": "10:15 am",
          "appointment_type": "shopping",
          "delivery_method": "pickup",
          "location_name": "Bloomington",
          "location_address": "201 W 87th St, Bloomington, MN",
          "appointment_date": "4/21/17",
          "delivery_date": "4/22/17"
          "status": "confirmed",
        },
      }]
  * @apiErrorExample {json} List error
  *    HTTP/1.1 500 Internal Server Error
*/

module.exports = router;
