var express = require('express');
var router = express.Router();
var pool = require('../modules/database.js');
var formatters = require('../modules/formatters.js');
var formatTimeForPostgres = formatters.formatTimeForPostgres;
var formatTimeForClient = formatters.formatTimeForClient;

/**
  * @api {get} /schedule/types Get Appointment Type Options
  * @apiVersion 0.1.0
  * @apiName GetScheduleTypes
  * @apiGroup Schedule
  * @apiDescription Retrieve all appointment types from the "appointment_types" table of the database.
  *
  * @apiSuccess {String[]} appointmentTypesArray Array of strings corresponding to all available appointment types.
  *
  * @apiErrorExample {json} Get Error:
  *    HTTP/1.1 500 Internal Server Error
*/
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
              var appointmentTypesArray = result.rows.map(function(apptTypeObj) {
                return apptTypeObj.appointment_type;
              });
              res.send(appointmentTypesArray);
            }
        }); // end query callback
      } // end DB connection if-else
    }); // end pool.connect
  } else { // user not authenticated
    res.sendStatus(401);
  }
});

/**
  * @api {get} /schedule/days Get Appointment Day Options
  * @apiVersion 0.1.0
  * @apiName GetScheduleDays
  * @apiGroup Schedule
  * @apiDescription Retrieve all days from the "days" table of the database.
  *
  * @apiSuccess {String[]} daysArray Array of strings corresponding to all available days for which an appointment slot can be scheduled.
  *
  * @apiErrorExample {json} Get Error:
  *    HTTP/1.1 500 Internal Server Error
*/
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
              var daysArray = result.rows.map(function(dayNamesObj) {
                return dayNamesObj.name;
              });
              res.send(daysArray);
            }
        }); // end query callback
      } // end DB connection if-else
    }); // end pool.connect
  } else { // user not authenticated
    res.sendStatus(401);
  }
});

/**
  * @api {get} /schedule/days Get Delivery Method Options
  * @apiVersion 0.1.0
  * @apiName GetDeliveryMethods
  * @apiGroup Schedule
  * @apiDescription Retrieve all delivery methods from the "delivery_methods" table of the database.
  *
  * @apiSuccess {String[]} deliveryMethodsArray Array of strings corresponding to all available delivery methods for an appointment slot.
  *
  * @apiErrorExample {json} Get Error:
  *    HTTP/1.1 500 Internal Server Error
*/
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
              var deliveryMethodsArray = result.rows.map(function(deliveryMethodsObj) {
                return deliveryMethodsObj.delivery_method;
              });
              res.send(deliveryMethodsArray);
            }
        }); // end query callback
      } // end DB connection if-else
    }); // end pool.connect
  } else { // user not authenticated
    res.sendStatus(401);
  }
});

/**
  * @api {get} /schedule/locations Get Locations
  * @apiVersion 0.1.0
  * @apiName GetLocations
  * @apiGroup Schedule
  * @apiDescription Retrieve all Bridging locations from the "locations" table of the database.
  *
  * @apiSuccess {String[]} locationsArray Array of strings corresponding to all available Bridging locations where an appointment can be made.
  *
  * @apiErrorExample {json} Get Error:
  *    HTTP/1.1 500 Internal Server Error
*/
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
              var locationsArray = result.rows.map(function(locationsObj) {
                return locationsObj.location;
              });
              res.send(locationsArray);
            }
        }); // end query callback
      } // end DB connection if-else
    }); // end pool.connect
  } else { // user not authenticated
    res.sendStatus(401);
  }
});

/**
  * @api {get} /schedule/default Get All Current Appointment Slots
  * @apiVersion 0.1.0
  * @apiName GetDefaultSchedule
  * @apiGroup Schedule
  * @apiDescription Retrieve all current appointment slots from the "appointment_slots" table of the database and their associated information.
  *
  * @apiSuccess {Object[]} defaultScheduleArray Array of objects corresponding to all current appointment slots.
  * @apiSuccess {Number} defaultScheduleArray.appointment_slot_id Unique ID of the appointment slot.
  * @apiSuccess {String} defaultScheduleArray.appointment_type Name of appointment type ("shopping" or "new bed").
  * @apiSuccess {String} defaultScheduleArray.day Day of appointment slot.
  * @apiSuccess {String} defaultScheduleArray.delivery_method Delivery method of appointment slot ("pickup" or "delivery").
  * @apiSuccess {String} defaultScheduleArray.location_name Name of Bridging location ("Bloomington" or "Roseville").
  * @apiSuccess {Moment} defaultScheduleArray.start_time Time the appointment starts, converted to a Moment.js Object.
  * @apiSuccess {Moment} defaultScheduleArray.end_time Time the appointment ends, converted to a Moment.js Object.
  * @apiSuccess {Number} defaultScheduleArray.num_allowed Maximum number of appointments allowed to be scheduled during the appointment slot.
  *
  * @apiErrorExample {json} Get Error:
  *    HTTP/1.1 500 Internal Server Error
*/
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
                        'JOIN "locations" ON "locations"."id" = "appointment_slots"."location_id" ' +
                        'ORDER BY "days"."id", "locations"."location", "appointment_slots"."start_time", "delivery_methods"."delivery_method";',
          function(queryErr, result) { // query callback
            done();
            if (queryErr) {
              console.log('error making query:', queryErr);
              res.sendStatus(500);
            } else {
              var defaultScheduleArray = result.rows;
              defaultScheduleArray.forEach(function(appointmentSlotObj) {
                appointmentSlotObj.start_time = formatTimeForClient(appointmentSlotObj.start_time);
                appointmentSlotObj.end_time = formatTimeForClient(appointmentSlotObj.end_time);
              });
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
  * @api {get} /schedule/default Get Specific Default Appointment Slot
  * @apiVersion 0.1.0
  * @apiName GetOneDefaultAppointmentSlot
  * @apiGroup Schedule
  * @apiDescription Retrieve a specific appointment slot from the "appointment_slots" table of the database and its associated information.
  *
  * @apiParam {Number} appointment_slot_id Unique ID of the appointment slot.
  *
  * @apiSuccess {Number} appointment_slot_id Unique ID of the appointment slot.
  * @apiSuccess {String} appointment_type Name of appointment type ("shopping" or "new bed").
  * @apiSuccess {String} day Day of appointment slot.
  * @apiSuccess {String} delivery_method Delivery method of appointment slot ("pickup" or "delivery").
  * @apiSuccess {String} location_name Name of Bridging location ("Bloomington" or "Roseville").
  * @apiSuccess {Moment} start_time Time the appointment starts, converted to a Moment.js Object.
  * @apiSuccess {Moment} end_time Time the appointment ends, converted to a Moment.js Object.
  * @apiSuccess {Number} num_allowed Maximum number of appointments allowed to be scheduled during the appointment slot.
  *
  * @apiErrorExample {json} Get Error:
  *    HTTP/1.1 500 Internal Server Error
*/
router.get('/:appointment_slot_id', function(req, res) {
  if (req.isAuthenticated()) { // user is authenticated
    var appointment_slot_id = req.params.appointment_slot_id;
    pool.connect(function(err, database, done) {
      if (err) { // connection error
        console.log('error connecting to the database:', err);
      } else { // we connected
        database.query('SELECT "appointment_slots"."id" AS "appointment_slot_id", "appointment_types"."appointment_type", "days"."name" AS "day", "delivery_methods"."delivery_method", "locations"."location" AS "location_name", "appointment_slots"."start_time", "appointment_slots"."end_time", "appointment_slots"."num_allowed" ' +
                        'FROM "appointment_slots" ' +
                        'JOIN "appointment_types" ON "appointment_types"."id" = "appointment_slots"."appointment_type_id" ' +
                        'JOIN "days" ON "days"."id" = "appointment_slots"."day_id" ' +
                        'JOIN "delivery_methods" ON "delivery_methods"."id" = "appointment_slots"."delivery_method_id" ' +
                        'JOIN "locations" ON "locations"."id" = "appointment_slots"."location_id" ' +
                        'WHERE "appointment_slots"."id" = $1;', [appointment_slot_id],
          function(queryErr, result) { // query callback
            done();
            if (queryErr) {
              console.log('error making query:', queryErr);
              res.sendStatus(500);
            } else {
              console.log('sucessful get from /schedule/:appointment_slot_id', result.rows);
              var appointmentSlotObj = '';
              if (result.rows.length) {
                appointmentSlotObj = result.rows[0];
                var start_hours = appointmentSlotObj.start_time.substring(0, 2);
                var start_minutes = appointmentSlotObj.start_time.substring(3, 5);
                var end_hours = appointmentSlotObj.end_time.substring(0, 2);
                var end_minutes = appointmentSlotObj.end_time.substring(3, 5);
                appointmentSlotObj.start_time = new Date(1970, 0, 1, start_hours, start_minutes, 0, 0);
                appointmentSlotObj.end_time = new Date(1970, 0, 1, end_hours, end_minutes, 0, 0);
              }
              console.log('sending back specific appt slot:', appointmentSlotObj);
              res.send(appointmentSlotObj);
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
  * @apiGroup Schedule
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
  * @apiSuccess {Number} appointment_slot_id Unique ID of the new appointment slot.
  *
  * @apiErrorExample {json} Post Error:
  *    HTTP/1.1 500 Internal Server Error
*/
router.post('/default', function(req, res) {
  if (req.isAuthenticated()) { // user is authenticated
    console.log('request being made to add a new appt slot:', req.body);
    var appointment_type = req.body.appointment_type;
    var day = req.body.day;
    var delivery_method = req.body.delivery_method;
    var location_name = req.body.location_name;
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
                        [appointment_type, day, delivery_method, location_name, start_time, end_time, num_allowed],
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

/**
  * @api {put} /schedule/default Update a Current Appointment Slot
  * @apiVersion 0.1.0
  * @apiName PutAppointmentSlot
  * @apiGroup Schedule
  * @apiDescription Updates a current appointment slot in the "appointment_slots" table of the database.
  *
  * @apiParam {Number} id Unique ID of the new appointment slot.
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
router.put('/default', function(req, res) {
  console.log('update for default slot: ', req.body);
  if (req.isAuthenticated()) { // user is authenticated
    var appointment_slot_id = req.body.appointment_slot_id;
    var appointment_type = req.body.appointment_type;
    var day = req.body.day;
    var delivery_method = req.body.delivery_method;
    var location_name = req.body.location_name;
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
                        [appointment_type, day, delivery_method, location_name, start_time, end_time, num_allowed, appointment_slot_id],
          function(queryErr, result) { // query callback
            done(); // release connection to the pool
            if (queryErr) {
              console.log('error making query on /schedule/default PUT', queryErr);
              res.sendStatus(500);
            } else {
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
// appointment slot will need num_allowed to be zeroed out by the administrator to prevent future appointments from being scheduled if a slot is no longer going to be used
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
