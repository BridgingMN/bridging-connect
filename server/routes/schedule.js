var express = require('express');
var router = express.Router();
var pool = require('../modules/database.js');


/**
  * @api {post} /schedule Add a New Appointment Slot
  * @apiVersion 0.1.0
  * @apiName PostAppointmentSlot
  * @apiGroup Appointment Schedule
  * @apiDescription Adds a new appointment slot to the "appointment_slots" table in the database.
  *
  * @apiParam {Number} agency_id Mandatory Unique ID of the agency the caseworker is associated with.
  * @apiParam {String} first First name of the caseworker from the "users" table.
  * @apiParam {String} last Last name of the caseworker from the "users" table.
  * @apiParam {String} day_phone Daytime phone number of the caseworker from the "users" table.
  * @apiParam {String} ext Phone number extension of caseworker from the "users" table.
  * @apiParam {String} email Mandatory Email address of caseworker from the "users" table.
  * @apiParam {Boolean} access_disabled Mandatory Current caseworker status. True = access disabled.
  * @apiParam {String} notes Any notes the administrator leaves regarding a caseworker.
  * @apiParam {String} user_type Mandatory Indicator for the type of user being created. Corresponds to an entry in the "user_types" table.
  *
  * @apiSuccess {Number} id Unique ID of the new caseworker.
  *
  * @apiErrorExample {json} Post Error:
  *    HTTP/1.1 500 Internal Server Error
*/
router.post('/', function(req, res) {
  console.log('in the post route for creating caseworker', req.body);
  if (req.isAuthenticated()) { // user is authenticated
    var agency_id = req.body.agency_id;
    var first = req.body.first;
    var last = req.body.last;
    var day_phone = req.body.day_phone || null;
    var ext = req.body.ext || null;
    var email = req.body.email;
    var access_disabled = req.body.access_disabled || false;
    var notes = req.body.notes || null;
    var user_type = 'caseworker';
    pool.connect(function(err, database, done) {
      if (err) { // connection error
        console.log('error connecting to the database:', err);
        res.sendStatus(500);
      } else { // we connected
        database.query('INSERT INTO "users" ("agency_id", "first", "last", "day_phone", "ext", "email", "access_disabled", "notes", "user_type_id") ' +
                        'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, ' +
                        '(SELECT "id" FROM "user_types" WHERE "user_type" = $9));',
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