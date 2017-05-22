var express = require('express');
var router = express.Router();
var moment = require('moment');
var pool = require('../modules/database.js');
var getAvailableAppts = require('../modules/getAvailableApptsCallback.js');

/**
  * @api {get} /appointments/existing Get User Appointments
  * @apiVersion 0.1.0
  * @apiName GetUserAppointments
  * @apiGroup Appointments
  * @apiDescription Get a user's existing appointments

  * @apiSuccess {Object[]} appointments   Array of appointment objects
  * @apiSuccess {Number} appointments.id   Unique ID of appointment
  * @apiSuccess {Object} appointments.client   Object with information about
      the client for whom the appointment was made
  * @apiSuccess {String} appointments.client.first   First name of client
  * @apiSuccess {String} appointments.client.last   Last name of client
  * @apiSuccess {String} appointments.client.street   Street address of client
  * @apiSuccess {String} appointments.client.city   City of client address
  * @apiSuccess {String} appointments.client.state   State of client address
  * @apiSuccess {Object} appointments.info   Object with information about the
      appointment
  * @apiSuccess {Number} appointments.info.appointment_number   Number to identify
      appointment in Bridging's separate database
  * @apiSuccess {String} appointments.info.start_time   Start time of appointment
  * @apiSuccess {String} appointments.info.end_time   End time of appointment
  * @apiSuccess {String} appointments.info.appointment_type   Type of appointment
      ("shopping" or "new bed")
  * @apiSuccess {String} appointments.info.location_name   "Roseville" or "Bloomington"
  * @apiSuccess {String} appointments.info.street   Street address of location
  * @apiSuccess {String} appointments.info.city   City of location address
  * @apiSuccess {String} appointments.info.state   State of location address
  * @apiSuccess {Date} appointments.info.date  Date of appointment
  * @apiSuccess {Date} appointments.info.delivery_date  Date of delivery (if applicable)
  * @apiSuccess {String} appointments.info.status   Status of appointment
      ("confirmed" or "pending")
  * @apiSuccess {String} appointments.info.delivery_method  Delivery method ("pickup" or "delivery")
  * @apiSuccessExample {json} Success-Response:
      HTTP/1.1 200 OK
      [{
        "id": 1,
        "client": {
          "first": "Jim",
          "last": "Tolliver",
          "address": "1400 Lizard Ln",
          "city": "St. Paul",
          "state": "MN"
        },
        "info": {
          "appointment_number": 4590,
          "start_time": "9:15 am",
          "end_time": "10:15 am",
          "appointment_type": "shopping",
          "delivery_method": "pickup",
          "location_name": "Bloomington",
          "location_address": "201 W 87th St",
          "city": "Bloomington",
          "state": "MN",
          "appointment_date": "April 21, 2017",
          "delivery_date": "April 22, 2017"
          "status": "confirmed",
        },
      }]
  * @apiErrorExample {json} List error
  *    HTTP/1.1 500 Internal Server Error
*/
router.get('/existing', function(req, res) {
    var user_id = req.user.id;
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
  * @apiSuccess {String} appointments.day   Day of week of appointment
  * @apiSuccess {String} appointments.end_time   End time of appointment
  * @apiSuccess {String} appointments.appointment_type   Type of appointment
      ("shopping" or "new bed")
  * @apiSuccess {String} appointments.delivery_method   "delivery" or "pickup"
  * @apiSuccess {String} appointments.location_name   Name of location
      ("Bloomington" or "Roseville")
  * @apiSuccess {String} appointments.street   Street address of location
  * @apiSuccess {String} appointments.city   City for address of location
    * @apiSuccess {String} appointments.state   State for address of location (2-letter abbreviation)

  * @apiSuccessExample {json} Success-Response:
      HTTP/1.1 200 OK
      [{
        "appointment_slot_id": 3,
        "appointment_type": "shopping",
        "city": "Bloomington",
        "day": "Monday",
        "date": "June 9, 2017",
        "delivery_method": "pickup",
        "end_time": "10:15 am",
        "location_name": "Bloomington",
        "start_time": "9:15 am",
        "street": "201 W 87th St",
        "state": "MN"
      }]
  * @apiErrorExample {json} List error
  *    HTTP/1.1 500 Internal Server Error
*/
router.get('/available', function(req, res) {
  var params = req.query;
  var min_date = moment(params.min_date).format('YYYY-MM-DD');
  var max_date = moment(params.max_date).format('YYYY-MM-DD');
  var appointment_type = params.appointment_type;
  var delivery_method = params.delivery_method;
  var location_id = params.location_id;

  getAvailableAppts(appointment_type, delivery_method, location_id, min_date, max_date, res);
});

/**
  * @api {post} /appointments/reserve Make Appointment
  * @apiVersion 0.1.0
  * @apiName MakeAppointment
  * @apiGroup Appointments
  * @apiDescription Makes appointment & saves to database

  * @apiParam {Date} date   Date of appointment
  * @apiParam {String} start_time   Start time of appointment
  * @apiParam {String} end_time   End time of appointment
  * @apiParam {Number} user_id   Unique id of user creating the appointment
  * @apiParam {Number} client_id   Unique id of client for whom appointment was created
  * @apiParam {Number} appointment_slot_id   Unique id of appointment slot
  * @apiParam {Date} appointment_date_added   Date on which appointment was created (current date)
  * @apiParam {String} status   Whether appointment is confirmed, canceled, or pending (should pass in pending)
  * @apiSuccess {Number} appointment_id   Unique ID of appointment that has been created
  * @apiSuccessExample Success-Response:
  *   HTTP/1.1 201 Created
  * @apiErrorExample {json} List error
  *    HTTP/1.1 500 Internal Server Error
*/
router.post('/reserve', function(req, res) {
  var appointment = req.body;
  var appointment_date = moment(appointment.date).format('YYYY-MM-DD');
  var user_id = appointment.user_id;
  var client_id = appointment.client_id;
  var appointment_slot_id = appointment.appointment_slot_id;
  var created_date = new Date();
  var status = appointment.status;

  pool.connect(function(connectionError, db, done) {
    if (connectionError) {
      console.log('ERROR CONNECTING TO DATABASE');
      res.sendStatus(500);
    } else {
      db.query('INSERT INTO "appointments" ("appointment_slot_id", "user_id", \
       "client_id", "created_date", "appointment_date", "status_id")  \
      VALUES ($1, $2, $3, $4, $5, (SELECT "id" FROM "statuses" \
      WHERE "status" = $6)) RETURNING "id"',
      [appointment_slot_id, user_id, client_id, created_date, appointment_date, status],
      function(queryError, result){
        done();
        if (queryError) {
          console.log('ERROR MAKING QUERY', queryError);
          res.sendStatus(500);
        } else {
          res.send(result.rows[0]);
        }
      });
    }
  });
});

/**
  * @api {put} /appointments/existing Update Appointment
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
  if (req.isAuthenticated()) { // user is authenticated
  // TODO: add code
  }
});

// START ADMIN-ONLY APPOINTMENT ROUTES
/**
  * @api {get} /agencies Get All Appointments
  * @apiVersion 0.1.0
  * @apiName GetAllAppointments
  * @apiGroup Appointments
  * @apiDescription Retrieves all appointments and associated appointment information.
  *
  * @apiSuccess {Number} id Unique ID of each appointment.
  * @apiSuccess {Date} appointment_date Date for which the appointment is scheduled.
  * @apiSuccess {Date} delivery_date Tentative delivery date, if any, for the appointment.
  * @apiSuccess {Number} confirmation_id Appointment confirmation number from the "appointments" table.
  * @apiSuccess {Number} appointment_slot_id Unique ID corresponding to an entry in the "appointment_slots" table.
  * @apiSuccess {String} appointment_type Appointment type - corresponds to an entry in the "appointment_types" table.
  * @apiSuccess {String} start_time Appointment start time - corresponds to the "appointment_slot_id" row in the "appointment_slots" table.
  * @apiSuccess {Number} agency_id Unique ID of the agency associated with each appointment.
  * @apiSuccess {String} name Name of the agency associated with each appointment.
  * @apiSuccess {Number} user_id Unique ID of the user associated with each appointment.
  * @apiSuccess {String} user_fist First name of the user associated with each appointment.
  * @apiSuccess {String} user_last Last name of the user associated with each appointment.
  * @apiSuccess {Number} client_id Unique ID of the client associated with each appointment.
  * @apiSuccess {String} client_fist First name of the client associated with each appointment.
  * @apiSuccess {String} client_last Last name of the client associated with each appointment.
  * @apiSuccess {Number} status_id Unique ID corresponding to an entry in the "statuses" table.
  * @apiSuccess {String} status Appointment status - corresponds to the "status_id" row in the "statuses" table.
  *
  * @apiErrorExample {json} Get Error:
  *    HTTP/1.1 500 Internal Server Error
*/
router.get('/all', function(req, res) {
  if (req.isAuthenticated()) { // user is authenticated
    pool.connect(function(err, database, done) {
      if (err) { // connection error
        console.log('error connecting to the database on /appointments/all GET route:', err);
        res.sendStatus(500);
      } else { // we connected
        database.query('SELECT "appointments"."id", "appointments"."appointment_date", "appointments"."delivery_date", "appointments"."confirmation_id", "appointments"."appointment_slot_id", "appointment_types"."appointment_type","appointment_slots"."start_time", "users"."agency_id", "agencies"."name", "appointments"."user_id", "users"."first" AS "user_first", "users"."last" AS "user_last", "appointments"."client_id", "clients"."first" AS "client_first", "clients"."last" AS "client_last", "appointments"."status_id", "statuses"."status" ' +
                        'FROM "appointments" ' +
                        'JOIN "appointment_slots" ON "appointments"."appointment_slot_id" = "appointment_slots"."id" ' +
                        'JOIN "appointment_types" ON "appointment_slots"."appointment_type_id" = "appointment_types"."id" ' +
                        'JOIN "users" ON "appointments"."user_id" = "users"."id" ' +
                        'JOIN "agencies" ON "users"."agency_id" = "agencies"."id" ' +
                        'JOIN "clients" ON "appointments"."client_id" = "clients"."id" ' +
                        'JOIN "statuses" ON "appointments"."status_id" = "statuses"."id";',
          function(queryErr, result) { // query callback
            done(); // release connection to the pool
            if (queryErr) {
              console.log('error making query on /appointments/all GET route:', queryErr);
              res.sendStatus(500);
            } else {
              console.log('successful GET from /appointments/all route:', result);
              res.send(result.rows);
            }
          }); // end query callback
        } // end if-else
      }); // end pool.connect
  } else { // user not authenticated
    res.sendStatus(401);
  }
});
/**
  * @api {get} /agencies Get All Pending Appointments
  * @apiVersion 0.1.0
  * @apiName GetPendingAppointments
  * @apiGroup Appointments
  * @apiDescription Retrieves all appointments with a status of "pending" and associated appointment information.
  *
  * @apiSuccess {Number} id Unique ID of each appointment.
  * @apiSuccess {Date} appointment_date Date for which the appointment is scheduled.
  * @apiSuccess {Date} delivery_date Tentative delivery date, if any, for the appointment.
  * @apiSuccess {Number} confirmation_id Appointment confirmation number from the "appointments" table.
  * @apiSuccess {Number} appointment_slot_id Unique ID corresponding to an entry in the "appointment_slots" table.
  * @apiSuccess {String} appointment_type Appointment type - corresponds to an entry in the "appointment_types" table.
  * @apiSuccess {String} start_time Appointment start time - corresponds to the "appointment_slot_id" row in the "appointment_slots" table.
  * @apiSuccess {Number} agency_id Unique ID of the agency associated with each appointment.
  * @apiSuccess {String} name Name of the agency associated with each appointment.
  * @apiSuccess {Number} user_id Unique ID of the user associated with each appointment.
  * @apiSuccess {String} user_fist First name of the user associated with each appointment.
  * @apiSuccess {String} user_last Last name of the user associated with each appointment.
  * @apiSuccess {Number} client_id Unique ID of the client associated with each appointment.
  * @apiSuccess {String} client_fist First name of the client associated with each appointment.
  * @apiSuccess {String} client_last Last name of the client associated with each appointment.
  * @apiSuccess {Number} status_id Unique ID corresponding to an entry in the "statuses" table.
  * @apiSuccess {String} status Appointment status - corresponds to the "status_id" row in the "statuses" table.
  *
  * @apiErrorExample {json} Get Error:
  *    HTTP/1.1 500 Internal Server Error
*/
router.get('/pending', function(req, res) {
  if (req.isAuthenticated()) { // user is authenticated
    var status = 'pending';
    pool.connect(function(err, database, done) {
      if (err) { // connection error
        console.log('error connecting to the database on /appointments/pending GET route:', err);
        res.sendStatus(500);
      } else { // we connected
        database.query('SELECT "appointments"."id", "appointments"."appointment_date", "appointments"."delivery_date", "appointments"."confirmation_id", "appointments"."appointment_slot_id", "appointment_types"."appointment_type","appointment_slots"."start_time", "users"."agency_id", "agencies"."name", "appointments"."user_id", "users"."first" AS "user_first", "users"."last" AS "user_last", "appointments"."client_id", "clients"."first" AS "client_first", "clients"."last" AS "client_last", "appointments"."status_id", "statuses"."status" ' +
                        'FROM "appointments" ' +
                        'JOIN "appointment_slots" ON "appointments"."appointment_slot_id" = "appointment_slots"."id" ' +
                        'JOIN "appointment_types" ON "appointment_slots"."appointment_type_id" = "appointment_types"."id" ' +
                        'JOIN "users" ON "appointments"."user_id" = "users"."id" ' +
                        'JOIN "agencies" ON "users"."agency_id" = "agencies"."id" ' +
                        'JOIN "clients" ON "appointments"."client_id" = "clients"."id" ' +
                        'JOIN "statuses" ON "appointments"."status_id" = "statuses"."id" ' +
                        'WHERE "status_id" = (SELECT "id" FROM "statuses" WHERE "status" = $1);',
                       [status],
          function(queryErr, result) { // query callback
            done(); // release connection to the pool
            if (queryErr) {
              console.log('error making query on /appointments/pending GET route:', queryErr);
              res.sendStatus(500);
            } else {
              console.log('successful GET from /appointments/pending route:', result);
              res.send(result.rows);
            }
          }); // end query callback
        } // end if-else
      }); // end pool.connect
  } else { // user not authenticated
    res.sendStatus(401);
  }
});

// END ADMIN-ONLY APPOINTMENT ROUTES

module.exports = router;
