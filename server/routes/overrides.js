var express = require('express');
var router = express.Router();
var pool = require('../modules/database.js');
var formatters = require('../modules/formatters.js');
var formatDateForPostgres = formatters.formatDateForPostgres;
var formatTimeForClient = formatters.formatTimeForClient;

/**
  * @api {get} /overrides Get Overrides By Date & Location
  * @apiVersion 0.1.0
  * @apiName GetOverriesDateLocation
  * @apiGroup Overrides
  * @apiDescription Retrieves overrides (if any) from the "overrides" table given a date and a location, and their associated appointment_slot information.
  *
  * @apiParam {Date} override_date Mandatory Date specifying which overrides are being requested.
  * @apiParam {String} location_name Mandatory Name of Bridging location for which overrides are being requested.
  *
  * @apiSuccess {Object[]} locationsArray Array of objects corresponding to all current appointment slots.
  * @apiSuccess {Number} locationsArray.appointment_slot_id Unique ID of the appointment slot.
  * @apiSuccess {String} locationsArray.appointment_type Name of appointment type ("shopping" or "new bed").
  * @apiSuccess {String} locationsArray.day Day of appointment slot.
  * @apiSuccess {String} locationsArray.delivery_method Delivery method of appointment slot ("pickup" or "delivery").
  * @apiSuccess {String} locationsArray.location_name Name of Bridging location ("Bloomington" or "Roseville").
  * @apiSuccess {Moment} locationsArray.start_time Time the appointment starts, converted to a Moment.js Object.
  * @apiSuccess {Moment} locationsArray.end_time Time the appointment ends, converted to a Moment.js Object.
  * @apiSuccess {Number} locationsArray.num_allowed Maximum number of appointments allowed to be scheduled during the appointment slot.
  *
  * @apiErrorExample {json} Get Error:
  *    HTTP/1.1 500 Internal Server Error
*/
router.get('/', function(req, res) {
  if (req.isAuthenticated()) { // user is authenticated
    var location_name = req.params.location_name;
    var override_date = req.params.override_date;
    var day_id = override_date.getDay() + 1;
    override_date = formatDateForPostgres(override_date);
    pool.connect(function(err, database, done) {
      if (err) { // connection error
        console.log('error connecting to the database:', err);
      } else { // we connected
        database.query('SELECT "appointment_slots"."id" AS "appointment_slot_id", "appointment_types"."appointment_type", "days"."name" AS "day", "delivery_methods"."delivery_method", "locations"."location" AS "location_name", "appointment_slots"."start_time", "appointment_slots"."end_time", "appointment_slots"."num_allowed", "overrides"."id" AS "override_id", "overrides"."override_date", "overrides"."num_allowed" AS "override_num_allowed" ' +
                        'FROM "appointment_slots" ' +
                        'JOIN "appointment_types" ON "appointment_types"."id" = "appointment_slots"."appointment_type_id" ' +
                        'JOIN "days" ON "days"."id" = "appointment_slots"."day_id" ' +
                        'JOIN "delivery_methods" ON "delivery_methods"."id" = "appointment_slots"."delivery_method_id" ' +
                        'JOIN "locations" ON "locations"."id" = "appointment_slots"."location_id" ' +
                        'LEFT JOIN "overrides" ON ("overrides"."appointment_slot_id", "overrides"."override_date") = ("appointment_slots"."id", $3) ' +
                        'WHERE ("appointment_slots"."day_id", "appointment_slots"."location_id") = ($1, (SELECT "id" FROM "locations" WHERE "location" = $2));',
                        [day_id, location_name, override_date],
          function(queryErr, result) { // query callback
            done();
            if (queryErr) {
              console.log('error making query:', queryErr);
              res.sendStatus(500);
            } else {
              console.log('sucessful get from /overrides', result.rows);
              var overridesArray = result.rows;
              overridesArray.forEach(function(appointmentSlotObj) {
                appointmentSlotObj.start_time = formatTimeForClient(appointmentSlotObj.start_time);
                appointmentSlotObj.end_time = formatTimeForClient(appointmentSlotObj.end_time);
              });
              console.log('overrides array formatted:', overridesArray);
              res.send(overridesArray);
            }
        }); // end query callback
      } // end DB connection if-else
    }); // end pool.connect
  } else { // user not authenticated
    res.sendStatus(401);
  }
});

/**
  * @api {post} /overrides Add a Schedule Override
  * @apiVersion 0.1.0
  * @apiName PostOverrides
  * @apiGroup Overrides
  * @apiDescription Add a new appointment slot override to the "overrides" table.
  *
  * @apiParam {Date} override_date Mandatory Date for which the override will be applied.
  * @apiParam {Object[]} overridesArray Mandatory Array of objects corresponding to all appointment slots to be added to the overrides table.
  * @apiParam {Number} overridesArray.appointment_slot_id Mandatory Unique ID corresponding to an entry in the "appointment_slots" table.
  * @apiParam {Number} overridesArray.override_num_allowed Mandatory Number of appointments allowed for the new appointment slot.
  *
  * @apiSuccess {Number[]} overrideIdArray Array of unique ID's associated with each overrides row insert.
  * @apiSuccess {Number} overrideIdArray.override_id Unique ID associated with override insert.
  * @apiSuccess {Number} overrideIdArray.appointment_slot_id Unique ID of the appointment slot associated with each override.
  * @apiSuccess {Number} overrideIdArray.override_num_allowed Number of appointments allowed for each overridden appointment slot.
  *
  * @apiErrorExample {json} Post Error:
  *    HTTP/1.1 500 Internal Server Error
*/
router.post('/', function(req, res) {
  if (req.isAuthenticated()) { // user is authenticated
    var override_date = formatDateForPostgres(req.body.override_date);
    var overridesArray = req.body.overridesArray;
    var queryString = 'INSERT INTO "overrides" ("appointment_slot_id", "num_allowed") VALUES ';
    for (var i = 0; i < overridesArray.length; i++) {
      var overrideInfoObj = overridesArray[i];
      queryString += '(' + overrideInfoObj.appointment_slot_id + ', \'' + override_date + '\', ' + overrideInfoObj.override_num_allowed + ')';
      if (i < overridesArray.length - 1) {
        queryString += ', ';
      }
    }
    queryString += ' RETURNING "id" AS "override_id", "appointment_slot_id", "override_date", "num_allowed" AS "override_num_allowed";';
    pool.connect(function(err, database, done) {
      if (err) { // connection error
        console.log('error connecting to the database:', err);
        res.sendStatus(500);
      } else { // we connected
        database.query(queryString, function(queryErr, result) { // query callback
            done(); // release connection to the pool
            if (queryErr) {
              console.log('error making query on /overrides POST', queryErr);
              res.sendStatus(500);
            } else {
              console.log('successful insert into "overrides"', result);
              res.send(result.rows);
            }
        }); // end query
      } // end if-else
    }); // end pool.connect
  } else { // user NOT authenticated
    res.sendStatus(401);
  }
});

/**
  * @api {put} /overrides Adjust Schedule Overrides
  * @apiVersion 0.1.0
  * @apiName PutOverrides
  * @apiGroup Overrides
  * @apiDescription Adjust appointment slot overrides for a particular date in "overrides" table.
  *
  * @apiParam {Object[]} overridesArray Mandatory Array of objects corresponding to all rows in the "overrides" table to be updated.
  * @apiParam {Number} overridesArray.override_id Mandatory Unique ID corresponding to the row in the "overrides" table to be updated.
  * @apiParam {Number} overridesArray.override_num_allowed Mandatory Number of appointments allowed for the override_id.
  *
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  * @apiErrorExample {json} Post Error:
  *    HTTP/1.1 500 Internal Server Error
*/
router.put('/', function(req, res) {
  if (req.isAuthenticated()) { // user is authenticated
    var overridesArray = req.body.overridesArray;
    var queryString = 'UPDATE "overrides" SET "num_allowed" = "updates"."num_allowed" FROM (VALUES ';
    for (var i = 0; i < overridesArray.length; i++) {
      var overrideInfoObj = overridesArray[i];
      queryString += '(' + overrideInfoObj.appointment_slot_id + '\', ' + overrideInfoObj.override_num_allowed + ')';
      if (i < overridesArray.length - 1) {
        queryString += ', ';
      }
    }
    queryString += ') AS "updates"("override_id", "num_allowed") WHERE "updates"."override_id" = "overrides"."id" RETURNING "id" AS "override_id", "appointment_slot_id", "override_date", "overrides"."num_allowed";';
    pool.connect(function(err, database, done) {
      if (err) { // connection error
        console.log('error connecting to the database:', err);
        res.sendStatus(500);
      } else { // we connected
        database.query(queryString, function(queryErr, result) { // query callback
            done(); // release connection to the pool
            if (queryErr) {
              console.log('error making query on /overrides POST', queryErr);
              res.sendStatus(500);
            } else {
              console.log('successful insert into "overrides"', result);
              res.send(result.rows);
            }
        }); // end query
      } // end if-else
    }); // end pool.connect
  } else { // user NOT authenticated
    res.sendStatus(401);
  }
});

module.exports = router;