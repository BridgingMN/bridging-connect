var express = require('express');
var router = express.Router();
var pool = require('../modules/database.js');
var json2csv = require('json2csv');
var formatDateForCsv = require('../modules/formatters.js').formatDateForCsv;


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
      db.query('SELECT "confirmation_id" AS "Confirmation", "created_date" AS "Created", ("users"."first"||\' \'||"users"."last") AS "Creator", "appointment_date" AS "Date", "appointment_slots"."start_time" AS "Start Time", "appointment_slots"."end_time" AS "End Time", "users"."first" AS "First", "users"."last" AS "Last", "agencies"."name" AS "Referring Agency", "users"."day_phone" AS "Daytime Phone", "users"."ext" AS "Extension", "users"."email" AS "E-mail", "appointment_types"."appointment_type" AS "Schedule", "locations"."location" AS "Location", "status" AS "Status", "agencies"."bridging_agency_id" AS "Agency ID", "users"."department" AS "Department/Program", "clients"."street" AS "Client Address (include apartment #)", "clients"."city" AS "Client City", "clients"."state" AS "Client State", "clients"."zip_code" AS "Client Zip Code", "clients"."dob" AS "Client Date of Birth", "race_ethnicity"."race_ethnicity" AS "Client Ethnicity", "clients"."first" AS "Client First Name", "clients"."last" AS "Client Last Name", "clients"."email" AS "Client e-mail address", "clients"."agency_tax_exempt" AS "(Prices include sales tax) If AGENCY is paying is Agency tax exempt?", "clients"."additional_notes" AS "Additional Notes", "clients"."age_of_others_in_household" AS "Age of ALL others in household", "clients"."alternate_phone" AS "Alternate Client Phone Number", "clients"."building_access_code" AS "Building-Client access code", "clients"."ctpappointment" AS "CTPAppointment", "clients"."ctpdelivery" AS "CTPDelivery", "clients"."ctpnewitems" AS "CTPNEWItems", "clients"."age" AS "Client Age", "clients"."marital_status" AS "Client Marital Status", "clients"."sex" AS "Client Sex", "clients"."yearly_income" AS "Client Yearly Income", "clients"."client_approves_speaking_with_staff" AS "Client approves speaking with a staff member about their Bridging experience", "clients"."completed_client_checklist" AS "Completed Client Checklist", "clients"."county" AS "County Client Lives In", "appointments"."delivery_date" AS "DELIVERY DATE (given by Bridging)", "clients"."client_understands_furniture_is_used" AS "Does your client understand that the furniture is used?", "clients"."client_understands_furniture_must_be_moved_within_48hrs" AS "Does your client understand that the furniture must be moved within 48 hours?", "clients"."how_long_homeless" AS "For how long was the client homeless?", "clients"."used_bridging_services_previously" AS "Has client accessed Bridging services in the past?", "clients"."home_visit_completed" AS "Home Visit Completed", "clients"."household_size" AS "Household Size", "clients"."num_children_17_and_under" AS "How many children in the household are 17 and under?", "clients"."if_other_who_paying_new_items" AS "If OTHER who is paying for NEW items?", "clients"."if_other_who_paying_delivery" AS "If OTHER  who is paying for delivery?", "clients"."if_other_who_paying_appointment" AS "If OTHER  who is paying for the appointment?", "clients"."agency_billing_id" AS "If there is an ID number used by your agency for billing purposes  enter it here:", "clients"."if_yes_client_email_or_phone" AS "If yes  client\'s email or phone number", "clients"."elevator_in_building" AS "Is there an elevator in the building?", "clients"."new_full_mattress_and_box_spring" AS "NEW Full Mattress and Box Spring", "clients"."new_queen_mattress_and_box_spring" AS "NEW Queen Mattress and Box Spring", "clients"."new_queen_king_bed_frame" AS "NEW Queen/King Bed Frame", "clients"."new_twin_mattress_and_box_spring" AS "NEW Twin Mattress and Box Spring", "clients"."new_twin_full_bed_frame" AS "NEW Twin/Full Bed Frame", "clients"."new_beds_and_frames_needed" AS "NEW beds and frames needed?", "clients"."num_bedrooms" AS "Number of Bedrooms", "clients"."primary_phone" AS "Primary Client Phone Number", "clients"."used_beds_needed" AS "USED Beds Needed (GENERAL GUIDELINES - Household size of 1 - 4 = 1 bed  5-6 = 2 beds  7+ = 3 beds)", "clients"."was_client_homeless" AS "Was the client homeless?", "clients"."what_brought_client_to_bridging" AS "What brought the client to Bridging?", "clients"."what_floor_does_client_live_on" AS "What floor does the client live on?", "clients"."who_paying_for_new_beds_and_frames" AS "Who is paying for NEW Beds and Frames?", "clients"."who_paying_for_delivery" AS "Who is paying for delivery?", "clients"."who_paying_for_appointment" AS "Who is paying for the appointment?", "clients"."will_bring_interpreter" AS "Will bring an interpreter?", "clients"."will_bring_assistant_due_to_mental_health_or_physical_limits" AS "Will bring assistant required due to mental health or physical limitations?" ' +
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
              var appointmentsJsonString = JSON.stringify(result.rows);
              var appointmentsJson = JSON.parse(appointmentsJsonString);
              appointmentsJson = formatAppointmentsForExport(appointmentsJson);
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

function formatAppointmentsForExport(appointmentsJson) {
  return appointmentsJson.map(function(appointment) {
    var appointmentCopy = Object.assign({}, appointment);
    appointmentCopy['Created'] = formatDateForCsv(appointmentCopy['Created']);
    appointmentCopy['Date'] = formatDateForCsv(appointmentCopy['Date']);
    appointmentCopy['Client Date of Birth'] = formatDateForCsv(appointmentCopy['Client Date of Birth']);
    if (appointmentCopy['Home Visit Completed']) {
      appointmentCopy['Home Visit Completed'] = formatDateForCsv(appointmentCopy['Home Visit Completed']);
    }
    if (appointmentCopy['DELIVERY DATE (given by Bridging)']) {
      appointmentCopy['DELIVERY DATE (given by Bridging)'] = formatDateForCsv(appointmentCopy['Created']);
    }
    return appointmentCopy;
  });
}

module.exports = router;