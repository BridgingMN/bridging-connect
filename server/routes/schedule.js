var express = require('express');
var router = express.Router();
var pool = require('../modules/database.js');
var formatters = require('../modules/formatters.js');
var formatTimeForPostgres = formatters.formatTimeForPostgres;
var formatTimeForClient = formatters.formatTimeForClient;

// get appt types
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
              var appointmentTypesArray = result.rows.map(function(apptTypeObj) {
                return apptTypeObj.appointment_type;
              });
              console.log('appointment types formatted:', appointmentTypesArray);
              res.send(appointmentTypesArray);
            }
        }); // end query callback
      } // end DB connection if-else
    }); // end pool.connect
  } else { // user not authenticated
    res.sendStatus(401);
  }
});

// get appt days
router.get('/days', function(req, res) {
  if (req.isAuthenticated()) { // user is authenticated
    pool.connect(function(err, database, done) {
      if (err) { // connection error
        console.log('error connecting to the database:', err);
      } else { // we connected
        database.query('SELECT "name" FROM "days";',
          function(queryErr, result) { // query callback
            done();
            if (queryErr) {
              console.log('error making query:', queryErr);
              res.sendStatus(500);
            } else {
              console.log('sucessful get from /schedule/days', result.rows);
              var daysArray = result.rows.map(function(dayNamesObj) {
                return dayNamesObj.name;
              });
              console.log('appointment days formatted:', daysArray);
              res.send(daysArray);
            }
        }); // end query callback
      } // end DB connection if-else
    }); // end pool.connect
  } else { // user not authenticated
    res.sendStatus(401);
  }
});

// get delivery methods
router.get('/deliverymethods', function(req, res) {
  if (req.isAuthenticated()) { // user is authenticated
    pool.connect(function(err, database, done) {
      if (err) { // connection error
        console.log('error connecting to the database:', err);
      } else { // we connected
        database.query('SELECT "delivery_method" FROM "delivery_methods";',
          function(queryErr, result) { // query callback
            done();
            if (queryErr) {
              console.log('error making query:', queryErr);
              res.sendStatus(500);
            } else {
              console.log('sucessful get from /schedule/deliverymethods', result.rows);
              var deliveryMethodsArray = result.rows.map(function(deliveryMethodsObj) {
                return deliveryMethodsObj.delivery_method;
              });
              console.log('appointment delivery methods formatted:', deliveryMethodsArray);
              res.send(deliveryMethodsArray);
            }
        }); // end query callback
      } // end DB connection if-else
    }); // end pool.connect
  } else { // user not authenticated
    res.sendStatus(401);
  }
});

// get warehouse locations
router.get('/locations', function(req, res) {
  if (req.isAuthenticated()) { // user is authenticated
    pool.connect(function(err, database, done) {
      if (err) { // connection error
        console.log('error connecting to the database:', err);
      } else { // we connected
        database.query('SELECT "location" FROM "locations";',
          function(queryErr, result) { // query callback
            done();
            if (queryErr) {
              console.log('error making query:', queryErr);
              res.sendStatus(500);
            } else {
              console.log('sucessful get from /schedule/locations', result.rows);
              var locationsArray = result.rows.map(function(locationsObj) {
                return locationsObj.location;
              });
              console.log('appointment delivery methods formatted:', locationsArray);
              res.send(locationsArray);
            }
        }); // end query callback
      } // end DB connection if-else
    }); // end pool.connect
  } else { // user not authenticated
    res.sendStatus(401);
  }
});

// get current appointment slots
router.get('/default', function(req, res) {
  if (req.isAuthenticated()) { // user is authenticated
    pool.connect(function(err, database, done) {
      if (err) { // connection error
        console.log('error connecting to the database:', err);
      } else { // we connected
        database.query('SELECT "appointment_slots"."id" AS "appointment_slot_id", "appointment_types"."appointment_type", "days"."name" AS "day", "delivery_methods"."delivery_method", "locations"."location" AS "location_name", "appointment_slots"."start_time", "appointment_slots"."end_time", "appointment_slots"."num_allowed" ' +
                        'FROM "appointment_slots" ' +
                        'JOIN "appointment_types" ON "appointment_types"."id" = "appointment_slots"."appointment_type_id" ' +
                        'JOIN "days" ON "days"."id" = "appointment_slots"."day_id" ' +
                        'JOIN "delivery_methods" ON "delivery_methods"."id" = "appointment_slots"."delivery_method_id" ' +
                        'JOIN "locations" ON "locations"."id" = "appointment_slots"."location_id";',
          function(queryErr, result) { // query callback
            done();
            if (queryErr) {
              console.log('error making query:', queryErr);
              res.sendStatus(500);
            } else {
              console.log('sucessful get from /schedule/current', result.rows);
              var defaultScheduleArray = result.rows;
              defaultScheduleArray.forEach(function(appointmentSlotObj) {
                appointmentSlotObj.start_time = formatTimeForClient(appointmentSlotObj.start_time);
                appointmentSlotObj.end_time = formatTimeForClient(appointmentSlotObj.end_time);
              });
              console.log('default schedule array formatted:', defaultScheduleArray);
              res.send(defaultScheduleArray);
            }
        }); // end query callback
      } // end DB connection if-else
    }); // end pool.connect
  } else { // user not authenticated
    res.sendStatus(401);
  }
});

/**
  * @api {post} /schedule/default Add a New Appointment Slot
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
router.post('/default', function(req, res) {
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
                        'VALUES ((SELECT "id" FROM "appointment_types" WHERE "appointment_type" = $1), ' +
                        '(SELECT "id" FROM "days" WHERE "name" = $2), ' +
                        '(SELECT "id" FROM "delivery_methods" WHERE "delivery_method" = $3), ' +
                        '(SELECT "id" FROM "locations" WHERE "location" = $4), ' +
                        '$5, $6, $7) ' +
                        'RETURNING "id";',
                        [appointment_type, day, delivery_method, location, start_time, end_time, num_allowed],
          function(queryErr, result) { // query callback
            done(); // release connection to the pool
            if (queryErr) {
              console.log('error making query on /schedule/default POST', queryErr);
              res.sendStatus(500);
            } else {
              console.log('successful insert into "appointment_slots"', result);
              res.send(result);
            }
        }); // end query
      } // end if-else
    }); // end pool.connect
  } else { // user NOT authenticated
    res.sendStatus(401);
  }
});

// update an appointment slot
router.put('/default', function(req, res) {
  if (req.isAuthenticated()) { // user is authenticated
    var appointment_slot_id = req.body.appointment_slot_id;
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
        database.query('UPDATE "appointment_slots" SET ("appointment_type_id", "day_id", "delivery_method_id", "location_id", "start_time", "end_time", "num_allowed") = ' +
                        '((SELECT "id" FROM "appointment_types" WHERE "appointment_type" = $1), ' +
                        '(SELECT "id" FROM "days" WHERE "name" = $2), ' +
                        '(SELECT "id" FROM "delivery_methods" WHERE "delivery_method" = $3), ' +
                        '(SELECT "id" FROM "locations" WHERE "location" = $4), ' +
                        '$5, $6, $7) ' +
                        'WHERE "id" = $8;',
                        [appointment_type, day, delivery_method, location, start_time, end_time, num_allowed, appointment_slot_id],
          function(queryErr, result) { // query callback
            done(); // release connection to the pool
            if (queryErr) {
              console.log('error making query on /schedule/default PUT', queryErr);
              res.sendStatus(500);
            } else {
              console.log('successful update of "appointment_slots"', result);
              res.send(result);
            }
        }); // end query
      } // end if-else
    }); // end pool.connect
  } else { // user NOT authenticated
    res.sendStatus(401);
  }
});

// delete an appointment slot
// CURRENTLY Appointment slot cannot be deleted if an appointment with that appointment_slot_id exists in the DB due to foreign key constraint.
// either need to relax conditions on the appointments table (if this is an option), or build out logic to deal with this.
//
// router.delete('/:appointment_slot_id', function(req, res) {
//   if (req.isAuthenticated()) { // user is authenticated
//     var appointment_slot_id = req.params.appointment_slot_id;
//     pool.connect(function(err, database, done) {
//       if (err) { // connection error
//         console.log('error connecting to the database:', err);
//       } else { // we connected
//         database.query('DELETE FROM "appointment_slots" WHERE "id" = $1;', [appointment_slot_id],
//           function(queryErr, result) { // query callback
//             done();
//             if (queryErr) {
//               console.log('error making query:', queryErr);
//               res.sendStatus(500);
//             } else {
//               console.log('sucessful deletion from /schedule/:appointment_slot_id', result);
//               res.sendStatus(200);
//             }
//         }); // end query callback
//       } // end DB connection if-else
//     }); // end pool.connect
//   } else { // user not authenticated
//     res.sendStatus(401);
//   }
// });


module.exports = router;