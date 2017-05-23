var express = require('express');
var router = express.Router();
var pool = require('../modules/database.js');
var formatters = require('../modules/formatters.js');
var formatTimeForPostgres = formatters.formatTimeForPostgres;


router.get('/types', function(req, res) {
  if (req.isAuthenticated()) { // user is authenticated
    pool.connect(function(err, database, done) {
      if (err) { // connection error
        console.log('error connecting to the database:', err);
      } else { // we connected
        database.query('SELECT "appointment_type" FROM "appointment_types";',
          function(queryErr, result) { // query callback
            done();
            if (queryErr) {
              console.log('error making query:', queryErr);
              res.sendStatus(500);
            } else {
              console.log('sucessful get from /schedule/types', result.rows);
              var appointment_types = result.rows.map(function(apptTypeObj) {
                return apptTypeObj.appointment_type;
              });
              console.log('appointment types formatted:', appointment_types);
              res.send(appointment_types);
            }
        }); // end query callback
      } // end DB connection if-else
    }); // end pool.connect
  } else { // user not authenticated
    res.sendStatus(401);
  }
});

/**
  * @api {post} /schedule Add a New Appointment Slot
  * @apiVersion 0.1.0
  * @apiName PostAppointmentSlot
  * @apiGroup Appointment Schedule
  * @apiDescription Adds a new appointment slot to the "appointment_slots" table in the database.
  *
  * @apiParam {String} appointment_type Mandatory Type of appointment corresponding to an entry in the "appointment_types" table.
  * @apiParam {String} day Mandatory Day name corresponding to an entry in the "days" table.
  * @apiParam {String} delivery_method Mandatory Delivery method name corresponding to an entry in the "delivery_methods" table.
  * @apiParam {String} location Mandatory Location name corresponding to an entry in the "locations" table.
  * @apiParam {Time} start_time Mandatory Start time for the new appointment slot.
  * @apiParam {Time} end_time Mandatory End time for the new appointment slot.
  * @apiParam {Number} num_allowed Mandatory Number of appointments allowed for the new appointment slot.
  *
  * @apiSuccess {Number} id Unique ID of the new caseworker.
  *
  * @apiErrorExample {json} Post Error:
  *    HTTP/1.1 500 Internal Server Error
*/
router.post('/', function(req, res) {
  console.log('in the post route for creating caseworker', req.body);
  if (req.isAuthenticated()) { // user is authenticated
    var appointment_type = req.body.appointment_type;
    var day = req.body.day;
    var delivery_method = req.body.delivery_method;
    var location = req.body.location;
    var start_time = formatTimeForPostgres(req.body.start_time);
    var end_time = formatTimeForPostgres(req.body.end_time);
    var num_allowed = req.body.num_allowed;
    pool.connect(function(err, database, done) {
      if (err) { // connection error
        console.log('error connecting to the database:', err);
        res.sendStatus(500);
      } else { // we connected
        database.query('INSERT INTO "appointment_slots" ("appointment_type_id", "day_id", "delivery_method_id", "location_id", "start_time", "end_time", "num_allowed") ' +
                        'VALUES ((SELECT "id" FROM "appointment_types" WHERE "appointment_type" = $$$$), ' +
                        '(SELECT "id" FROM "days" WHERE "name" = $$$$), ' +
                        '(SELECT "id" FROM "delivery_method_id" WHERE "name" = $$$$), ' +'
                        ');',
                        [agency_id, first, last, day_phone, ext, email, access_disabled, notes, user_type],
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






module.exports = router;