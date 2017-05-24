var express = require('express');
var router = express.Router();
var pool = require('../modules/database.js');
var formatters = require('../modules/formatters.js');
var formatDateForPostgres = formatters.formatDateForPostgres;
var formatTimeForPostgres = formatters.formatTimeForPostgres;
var formatTimeForClient = formatters.formatTimeForClient;

// /**
//   * @api {get} /overrides Get All Overrides
//   * @apiVersion 0.1.0
//   * @apiName GetAllOverries
//   * @apiGroup Schedule
//   * @apiDescription Retrieve all overrides from the "overrides" table of the database and their associated information.
//   *
//   * @apiSuccess {Object[]} locationsArray Array of objects corresponding to all current appointment slots.
//   * @apiSuccess {Number} locationsArray.appointment_slot_id Unique ID of the appointment slot.
//   * @apiSuccess {String} locationsArray.appointment_type Name of appointment type ("shopping" or "new bed").
//   * @apiSuccess {String} locationsArray.day Day of appointment slot.
//   * @apiSuccess {String} locationsArray.delivery_method Delivery method of appointment slot ("pickup" or "delivery").
//   * @apiSuccess {String} locationsArray.location_name Name of Bridging location ("Bloomington" or "Roseville").
//   * @apiSuccess {Moment} locationsArray.start_time Time the appointment starts, converted to a Moment.js Object.
//   * @apiSuccess {Moment} locationsArray.end_time Time the appointment ends, converted to a Moment.js Object.
//   * @apiSuccess {Number} locationsArray.num_allowed Maximum number of appointments allowed to be scheduled during the appointment slot.
//   *
//   * @apiErrorExample {json} Get Error:
//   *    HTTP/1.1 500 Internal Server Error
// */
// router.get('/default', function(req, res) {
//   if (req.isAuthenticated()) { // user is authenticated
//     pool.connect(function(err, database, done) {
//       if (err) { // connection error
//         console.log('error connecting to the database:', err);
//       } else { // we connected
//         database.query('SELECT "appointment_slots"."id" AS "appointment_slot_id", "appointment_types"."appointment_type", "days"."name" AS "day", "delivery_methods"."delivery_method", "locations"."location" AS "location_name", "appointment_slots"."start_time", "appointment_slots"."end_time", "appointment_slots"."num_allowed" ' +
//                         'FROM "appointment_slots" ' +
//                         'JOIN "appointment_types" ON "appointment_types"."id" = "appointment_slots"."appointment_type_id" ' +
//                         'JOIN "days" ON "days"."id" = "appointment_slots"."day_id" ' +
//                         'JOIN "delivery_methods" ON "delivery_methods"."id" = "appointment_slots"."delivery_method_id" ' +
//                         'JOIN "locations" ON "locations"."id" = "appointment_slots"."location_id";',
//           function(queryErr, result) { // query callback
//             done();
//             if (queryErr) {
//               console.log('error making query:', queryErr);
//               res.sendStatus(500);
//             } else {
//               console.log('sucessful get from /schedule/current', result.rows);
//               var defaultScheduleArray = result.rows;
//               defaultScheduleArray.forEach(function(appointmentSlotObj) {
//                 appointmentSlotObj.start_time = formatTimeForClient(appointmentSlotObj.start_time);
//                 appointmentSlotObj.end_time = formatTimeForClient(appointmentSlotObj.end_time);
//               });
//               console.log('default schedule array formatted:', defaultScheduleArray);
//               res.send(defaultScheduleArray);
//             }
//         }); // end query callback
//       } // end DB connection if-else
//     }); // end pool.connect
//   } else { // user not authenticated
//     res.sendStatus(401);
//   }
// });

/**
  * @api {post} /overrides Add a Schedule Override
  * @apiVersion 0.1.0
  * @apiName PostOverride
  * @apiGroup Overrides
  * @apiDescription Add a new appointment slot override to the "overrides" table.
  *
  * @apiParam {Number} appointment_slot_id Unique ID corresponding to an entry in the "appointment_slots" table.
  * @apiParam {String} appointment_type Mandatory Type of appointment corresponding to an entry in the "appointment_types" table.
  * @apiParam {String} delivery_method Mandatory Delivery method name corresponding to an entry in the "delivery_methods" table.
  * @apiParam {String} location Mandatory Location name corresponding to an entry in the "locations" table.
  * @apiParam {Date} override_date Mandatory Date for which the override will be applied.
  * @apiParam {Time} start_time Mandatory Start time for the new appointment slot.
  * @apiParam {Time} end_time Mandatory End time for the new appointment slot.
  * @apiParam {Number} num_allowed Mandatory Number of appointments allowed for the new appointment slot.
  *
  * @apiSuccess {Number} appointment_slot_id Unique ID of the new appointment slot.
  *
  * @apiErrorExample {json} Post Error:
  *    HTTP/1.1 500 Internal Server Error
*/
router.post('/', function(req, res) {
  if (req.isAuthenticated()) { // user is authenticated
    var appointment_slot_id = req.body.appointment_slot_id;
    var appointment_type = req.body.appointment_type;
    var delivery_method = req.body.delivery_method;
    var location = req.body.location;
    var override_date = formatDateForPostgres(req.body.override_date);
    var start_time = formatTimeForPostgres(req.body.start_time);
    var end_time = formatTimeForPostgres(req.body.end_time);
    var num_allowed = req.body.num_allowed;
    pool.connect(function(err, database, done) {
      if (err) { // connection error
        console.log('error connecting to the database:', err);
        res.sendStatus(500);
      } else { // we connected
        database.query('INSERT INTO "overrides" ("appointment_slot_id", "appointment_type_id", "delivery_method_id", "location_id", "override_date", "start_time", "end_time", "num_allowed") ' +
                        'VALUES ($1, ' +
                        '(SELECT "id" FROM "appointment_types" WHERE "appointment_type" = $2), ' +
                        '(SELECT "id" FROM "delivery_methods" WHERE "delivery_method" = $3), ' +
                        '(SELECT "id" FROM "locations" WHERE "location" = $4), ' +
                        '$5, $6, $7, $8) ' +
                        'RETURNING "id";',
                        [appointment_slot_id, appointment_type, delivery_method, location, override_date, start_time, end_time, num_allowed],
          function(queryErr, result) { // query callback
            done(); // release connection to the pool
            if (queryErr) {
              console.log('error making query on /overrides POST', queryErr);
              res.sendStatus(500);
            } else {
              console.log('successful insert into "overrides"', result);
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