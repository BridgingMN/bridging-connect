var express = require('express');
var router = express.Router();
var pool = require('../modules/database.js');
var json2csv = require('json2csv');


router.get('/:start/:end', function(req, res) {
  var startDate = req.params.start;
  var endDate = req.params.end;
  console.log('startDate', startDate);
  console.log('endDate', endDate);
  pool.connect(function(connectionError, db, done) {
    if (connectionError) {
      console.log('error connecting to database on /export route');
      res.sendStatus(500);
    } else {
      console.log('connected to the db on the /dataExport route');
      db.query('SELECT "confirmation_id" AS "Confirmation", "created_date" AS "Created", ("users"."first"||\' \'||"users"."last") AS "Creator", "appointment_date" AS "Date", "appointment_slots"."start_time" AS "Start Time", "appointment_slots"."end_time" AS "End Time", "users"."first" AS "First", "users"."last" AS "Last", "agencies"."name" AS "Referring Agency", "users"."day_phone" AS "Daytime Phone", "users"."ext" AS "Extension", "users"."email" AS "E-mail", "appointment_types"."appointment_type" AS "Schedule", "locations"."location" AS "Location", "status" AS "Status", "agencies"."bridging_agency_id" AS "Agency ID", "users"."department" AS "Department/Program", "clients"."street" AS "Client Address (include apartment #)", "clients"."city" AS "Client City", "clients"."state" AS "Client State", "clients"."zip_code" AS "Client Zip Code", "clients"."dob" AS "Client Date of Birth", "race_ethnicity"."race_ethnicity" AS "Client Ethnicity", "clients"."first" AS "Client First Name", "clients"."last" AS "Client Last Name", "appointments"."delivery_date" AS "DELIVERY DATE (given by Bridging)" ' +
                'FROM "appointments" ' +
                'JOIN "users" ON "users"."id" = "appointments"."user_id" ' +
                'JOIN "clients" ON "clients"."id" = "appointments"."client_id" ' +
                'JOIN "statuses" ON "statuses"."id" = "appointments"."status_id" ' +
                'JOIN "appointment_slots" ON "appointment_slots"."id" = "appointments"."appointment_slot_id" ' +
                'JOIN "agencies" ON "agencies"."id" = "users"."agency_id" ' +
                'JOIN "appointment_types" ON "appointment_types"."id" = "appointment_slots"."appointment_type_id" ' +
                'JOIN "locations" ON "locations"."id" = "appointment_slots"."location_id" ' +
                'LEFT JOIN "race_ethnicity" ON "race_ethnicity"."id" = "clients"."race_ethnicity_id" ' +
                'WHERE "appointment_date" >= $1 AND "appointment_date" <= $2;',
                [startDate, endDate],
        function(queryError, result) {
          done();
          if (queryError) {
            console.log('error making query on /dataExport route', queryError);
            res.sendStatus(500);
          } else {
            console.log('query successful', result.rows);
            if (!result.rows.length) {
              res.send('No appointments for the selected dates.');
            } else {
              // convert query result to JSON
              var appointmentsJsonString = JSON.stringify(result.rows)
              var appointmentsJson = JSON.parse(appointmentsJsonString);
              // convert JSON to CSV
              var appointmentsCsv = json2csv({data: appointmentsJson});
              // send CSV to client
              res.attachment('appointments.csv');
              res.status(200).send(appointmentsCsv);
            }
          }
        });
    }
  });
});

module.exports = router;