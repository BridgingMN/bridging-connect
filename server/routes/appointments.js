var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../modules/database.js');

/**
  * @api {get} /appointments/existing/:user_id Get User Appointments
  * @apiVersion 0.1.1
  * @apiName GetUserAppointments
  * @apiGroup Appointments
  * @apiDescription Get a user's existing appointments

  * @apiParam {Number} user_id User's unique ID

  * @apiSuccess {Object[]} appointments   Array of appointment objects
  * @apiSuccess {Number} appointments.id   Unique ID of appointment
  * @apiSuccess {Object} appointments.client   Object with information about
      the client for whom the appointment was made
  * @apiSuccess {String} appointments.client.first   First name of client
  * @apiSuccess {String} appointments.client.last   Last name of client
  * @apiSuccess {Object} appointments.client.address   Object containing address info for client
  * @apiSuccess {String} appointments.client.address.street   Client street address
  * @apiSuccess {String} appointments.client.address.city   City for address of client
  * @apiSuccess {String} appointments.client.address.state   State for address of client (2-letter abbreviation)
  * @apiSuccess {Object} appointments.info   Object with information about the
      appointment
  * @apiSuccess {Number} appointments.info.appointment_number   Number to identify
      appointment in Bridging's separate database
  * @apiSuccess {String} appointments.info.start_time   Start time of appointment
  * @apiSuccess {String} appointments.info.end_time   End time of appointment
  * @apiSuccess {String} appointments.info.appointment_type   Type of appointment
      ("shopping" or "new bed")
  * @apiSuccess {Object} appointments.info.location   Object with info about appointment location
  * @apiSuccess {String} appointments.info.location.name   "Roseville" or "Bloomington"
  * @apiSuccess {String} appointments.info.location.street   Street address of location
  * @apiSuccess {String} appointments.info.location.city   City for address of location
  * @apiSuccess {String} appointments.info.location.state   State for address of location (2-letter abbreviation)
  * @apiSuccess {Date} appointments.info.date  Date of appointment
  * @apiSuccess {Date} appointments.info.delivery_date  Date of delivery (if applicable)
  * @apiSuccess {String} appointments.info.delivery_date    Status of appointment
      ("confirmed" or "pending")
  * @apiSuccessExample {json} Success-Response:
      HTTP/1.1 200 OK
      [{
        "id": 1,
        "client": {
          "first": "Jim",
          "last": "Tolliver",
          "address": {
            "street": "1400 Lizard Ln",
            "city": "St. Paul",
            "state": "MN"
          }
        },
        "info": {
          "appointment_number" : 4590,
          "start_time": "9:15 am",
          "end_time": "10:15 am",
          "appointment_type": "shopping",
          "delivery_method": "pickup",
          "location": {
              "name": "Bloomington",
              "street": "201 W 87th St",
              "city": "Bloomington",
              "state": "MN",
            }
          "appointment_date": "4/21/17",
          "delivery_date": "4/22/17"
          "status": "confirmed",
        },
      }]
  * @apiErrorExample {json} List error
  *    HTTP/1.1 500 Internal Server Error
*/
router.get('/existing/:user_id', function(req, res) {
  // TODO: add code
});

/**
  * @api {get} /appointments/available Get Available Appointments
  * @apiVersion 0.1.0
  * @apiName GetAvailableAppointments
  * @apiGroup Appointments
  * @apiDescription Get appointment objects that match the parameters and still
    have available spots left

  * @apiParam {Date} min_date   Earliest date in range to be checked
  * @apiParam {Date} max_date   Latest date in range to be checked
  * @apiParam {String} appointment_type   Type of appointment ("shopping" or "new bed")
  * @apiParam {String} delivery_method  Method of delivery ("delivery" or "pickup")
  * @apiParam {Number} location_id  Unique ID of location (database ID for
                                    Bloomington or for Roseville)
  * @apiSuccess {Object[]} appointments   Array of appointment objects
  * @apiSuccess {Number} appointments.appointment_slot_id   Unique ID of appointment slot
  * @apiSuccess {Date} appointments.date  Date of appointment
  * @apiSuccess {String} appointments.start_time   Start time of appointment
  * @apiSuccess {String} appointments.end_time   End time of appointment
  * @apiSuccess {String} appointments.appointment_type   Type of appointment
      ("shopping" or "new bed")
  * @apiSuccess {String} appointments.delivery_method   "delivery" or "pickup"
  * @apiSuccess {Object} appointments.location   Object containing location info
  * @apiSuccess {String} appointments.location.name   Name of location
      ("Bloomington" or "Roseville")
  * @apiSuccess {String} appointments.location.street   Street address of location
  * @apiSuccess {String} appointments.location.city   City for address of location
  * @apiSuccess {String} appointments.location.state   State for address of location (2-letter abbreviation)
  * @apiSuccessExample {json} Success-Response:
      HTTP/1.1 200 OK
      [{
        "appointment_slot_id": 3,
        "date": "June 9, 2017",
        "start_time": "9:15 am",
        "end_time": "10:15 am",
        "appointment_type": "shopping",
        "delivery_method": "pickup",
        "location": {
          "name": "Bloomington",
          "street": "201 W 87th St",
          "city": "Bloomington",
          "state": "MN",
        }
      }]
  * @apiErrorExample {json} List error
  *    HTTP/1.1 500 Internal Server Error
*/
router.get('/available', function(req, res) {
  // TODO: add code
});

/**
  * @api {post} /appointments/reserve Make Appointment
  * @apiVersion 0.1.1
  * @apiName MakeAppointment
  * @apiGroup Appointments
  * @apiDescription Makes appointment & saves to database

  * @apiParam {Date} appointment_date   Date of appointment
  * @apiParam {Number} user_id   Unique id of user creating the appointment
  * @apiParam {Number} client_id   Unique id of client for whom appointment was created
  * @apiParam {Number} appointment_slot_id   Unique id of appointment slot
  * @apiParam {Date} created_date   Date on which appointment was created (current date)
  * @apiParam {String} status   Whether appointment is confirmed, canceled, or pending (should pass in pending)
  * @apiSuccess {Number} appointment_id   Unique ID of appointment that has been created
  * @apiErrorExample {json} List error
  *    HTTP/1.1 500 Internal Server Error
*/
router.post('/reserve', function(req, res) {
  // TODO: add code
});

/**
  * @api {put} /appointments/existing Update Appointment Status
  * @apiVersion 0.1.0
  * @apiName UpdateAppointment
  * @apiGroup Appointments
  * @apiDescription Updates status of an appointment in database

  * @apiParam {Number} appointment_id  Unique ID of appointment
  * @apiParam {String} status  Status of appointment ("confirmed", "pending", or "canceled")
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  * @apiErrorExample Not found error
  *    HTTP/1.1 404 Not found
*/
router.put('/existing', function(req, res) {
  // TODO: add code
});

module.exports = router;
