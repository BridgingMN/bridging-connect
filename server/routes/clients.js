var express = require('express');
var router = express.Router();
var formatters = require('../modules/formatters.js');
var formatDate = formatters.formatDate;
var formatTime = formatters.formatTime;
var formatDateForPostgres = formatters.formatDateForPostgres;
var formatClient = formatters.formatClient;

var pool = require('../modules/database.js');
/**
  * @api {post} /clients Add a client
  * @apiVersion 0.1.1
  * @apiName PostClient
  * @apiGroup Clients
  * @apiDescription Saves a client's information to database

  * @apiParam {String} first   First name of client
  * @apiParam {String} last   Last name of client
  * @apiParam {Date} dob  Client date of birth
  * @apiParam {String} race_ethnicity   Client race or ethnicity.
      Options: "African", "American Indian or Alaska Native",
      "Asian or Pacific Islander", "Black or African American", "Hispanic",
      "Mixed Racial Background", "White", "Other"
  * @apiParam {String} street   Street address of client
  * @apiParam {String} city   City of client address
  * @apiParam {String} state  State of client address (2-letter abbreviation)
  * @apiParam {String} zip_code   Client zip code

  * @apiSuccess {Number} id Unique ID of client that has been added
  * @apiErrorExample {json} Post error
  *    HTTP/1.1 500 Internal Server Error
*/
router.post('/', function(req, res) {
  var client = req.body;
<<<<<<< HEAD
  postClient(client)
=======

  console.log('client from other side', client);
  var first = client.first;
  var last = client.last;
  var dob = formatDateForPostgres(client.dob);
  var race_ethnicity = client.race_ethnicity;
  var street = client.street;
  var city = client.city;
  var state = client.state;
  var zip_code = client.zip_code;
  var county = client.county;
  var building_access_code = client.building_access_code;
  var primary_phone = client.primary_phone;
  var alternate_phone = client.alternate_phone;
  var email = client.email;
  var used_bridging_services_previously = client.used_bridging_services_previously;
  var marital_status = client.marital_status;
  var sex = client.sex;
  var age = client.age;
  var household_size = client.household_size;
  var age_of_others_in_household = client.age_of_others_in_household;
  var num_children_17_and_under = client.num_children_17_and_under;
  var num_bedrooms = client.num_bedrooms;
  var home_visit_completed = formatDateForPostgres(client.home_visit_completed);
  var completed_client_checklist = client.completed_client_checklist;
  var yearly_income = client.yearly_income;
  var was_client_homeless = client.was_client_homeless;
  var how_long_homeless = client.how_long_homeless;
  var what_brought_client_to_bridging = client.what_brought_client_to_bridging;
  var will_bring_interpreter = client.will_bring_interpreter;
  var will_bring_assistant_due_to_mental_health_or_physical_limits = client.will_bring_assistant_due_to_mental_health_or_physical_limits;
  var client_understands_furniture_is_used = client.client_understands_furniture_is_used;
  var client_understands_furniture_must_be_moved_within_48hrs = client. client_understands_furniture_must_be_moved_within_48hrs;
  var agency_billing_id = client.agency_billing_id;
  var who_paying_for_appointment = client.who_paying_for_appointment;
  var if_other_who_paying_appointment = client.if_other_who_paying_appointment;
  var who_paying_for_delivery = client.who_paying_for_delivery;
  var if_other_who_paying_delivery = client.if_other_who_paying_delivery;
  var what_floor_does_client_live_on = client.what_floor_does_client_live_on;
  var elevator_in_building = client.elevator_in_building;
  var additional_notes = client.additional_notes;
  var used_beds_needed = client.used_beds_needed;
  var new_beds_and_frames_needed = client.new_beds_and_frames_needed;
  var who_paying_for_new_beds_and_frames = client.who_paying_for_new_beds_and_frames;
  var if_other_who_paying_new_items = client.if_other_who_paying_new_items;
  var agency_tax_exempt = client.agency_tax_exempt;
  var new_twin_mattress_and_box_spring = client.new_twin_mattress_and_box_spring;
  var new_full_mattress_and_box_spring = client.new_full_mattress_and_box_spring;
  var new_queen_mattress_and_box_spring = client.new_queen_mattress_and_box_spring;
  var new_twin_full_bed_frame = client.new_twin_full_bed_frame;
  var new_queen_king_bed_frame = client.new_queen_king_bed_frame;
  var client_approves_speaking_with_staff = client.client_approves_speaking_with_staff;
  var if_yes_client_email_or_phone = client.if_yes_client_email_or_phone;


  postClient(first, last, dob, race_ethnicity, street, city, state, zip_code, county, building_access_code, primary_phone, alternate_phone, email, used_bridging_services_previously, marital_status, sex, age, household_size, age_of_others_in_household, num_children_17_and_under, num_bedrooms, home_visit_completed, completed_client_checklist, yearly_income, was_client_homeless, how_long_homeless, what_brought_client_to_bridging, will_bring_interpreter, will_bring_assistant_due_to_mental_health_or_physical_limits, client_understands_furniture_is_used, client_understands_furniture_must_be_moved_within_48hrs, agency_billing_id, who_paying_for_appointment, if_other_who_paying_appointment, who_paying_for_delivery, if_other_who_paying_delivery, what_floor_does_client_live_on, elevator_in_building, additional_notes, used_beds_needed, new_beds_and_frames_needed, who_paying_for_new_beds_and_frames, if_other_who_paying_new_items, agency_tax_exempt, new_twin_mattress_and_box_spring, new_full_mattress_and_box_spring, new_queen_mattress_and_box_spring, new_twin_full_bed_frame, new_queen_king_bed_frame, client_approves_speaking_with_staff, if_yes_client_email_or_phone)
>>>>>>> 429b57ac505eceff574900302d419035c616f8ed
  .then(function(result, error) {
    if (error) {
      console.log(error);
      res.sendStatus(500);
    } else {
      res.send(result);
    }
  });
});

<<<<<<< HEAD
function postClient(client) {
  cleanClient(client);
  return saveClient(client);
}

function cleanClient(client) {
  client.dob = formatDateForPostgres(client.dob);
  client.home_visit_completed = formatDateForPostgres(client.home_visit_completed);
}

function saveClient(client) {
  return pool.connect().then(function(db) {
    return db.query('INSERT INTO "clients" ("first", "last", "dob", "race_ethnicity_id", "street", "city", "state", "zip_code", "county", "building_access_code", "primary_phone", "alternate_phone", "email", "used_bridging_services_previously", "marital_status", "sex", "age", "household_size", "age_of_others_in_household", "num_children_17_and_under", "num_bedrooms", "home_visit_completed", "completed_client_checklist", "yearly_income", "was_client_homeless", "how_long_homeless", "what_brought_client_to_bridging", "will_bring_interpreter", "will_bring_assistant_due_to_mental_health_or_physical_limits", "client_understands_furniture_is_used", "client_understands_furniture_must_be_moved_within_48hrs", "agency_billing_id", "who_paying_for_appointment", "if_other_who_paying_appointment", "who_paying_for_delivery", "if_other_who_paying_delivery", "what_floor_does_client_live_on", "elevator_in_building", "additional_notes", "used_beds_needed", "new_beds_and_frames_needed", "who_paying_for_new_beds_and_frames", "if_other_who_paying_new_items", "agency_tax_exempt", "new_twin_mattress_and_box_spring", "new_full_mattress_and_box_spring", "new_queen_mattress_and_box_spring", "new_twin_full_bed_frame", "new_queen_king_bed_frame", "client_approves_speaking_with_staff", "if_yes_client_email_or_phone") ' +
    'VALUES ($1, $2, $3, ' +
    '(SELECT "id" FROM "race_ethnicity" WHERE "race_ethnicity" = $4),' +
    '$5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51) RETURNING "id"',
    [client.first, client.last, client.dob, client.race_ethnicity, client.street, client.city, client.state,
      client.zip_code, client.county, client.building_access_code, client.primary_phone, client.alternate_phone,
      client.email, client.used_bridging_services_previously, client.marital_status, client.sex, client.age,
      client.household_size, client.age_of_others_in_household, client.num_children_17_and_under, client.num_bedrooms,
      client.home_visit_completed, client.completed_client_checklist, client.yearly_income, client.was_client_homeless,
      client.how_long_homeless, client.what_brought_client_to_bridging, client.will_bring_interpreter,
      client.will_bring_assistant_due_to_mental_health_or_physical_limits, client.client_understands_furniture_is_used,
      client.client_understands_furniture_must_be_moved_within_48hrs, client.agency_billing_id,
      client.who_paying_for_appointment, client.if_other_who_paying_appointment, client.who_paying_for_delivery,
      client.if_other_who_paying_delivery, client.what_floor_does_client_live_on, client.elevator_in_building,
      client.additional_notes, client.used_beds_needed, client.new_beds_and_frames_needed,
      client.who_paying_for_new_beds_and_frames, client.if_other_who_paying_new_items, client.agency_tax_exempt,
      client.new_twin_mattress_and_box_spring, client.new_full_mattress_and_box_spring,
      client.new_queen_mattress_and_box_spring, client.new_twin_full_bed_frame, client.new_queen_king_bed_frame,
      client.client_approves_speaking_with_staff, client.if_yes_client_email_or_phone])
=======
function postClient(first, last, dob, race_ethnicity, street, city, state, zip_code, county, building_access_code, primary_phone, alternate_phone, email, used_bridging_services_previously, marital_status, sex, age, household_size, age_of_others_in_household, num_children_17_and_under, num_bedrooms, home_visit_completed, completed_client_checklist, yearly_income, was_client_homeless, how_long_homeless, what_brought_client_to_bridging, will_bring_interpreter, will_bring_assistant_due_to_mental_health_or_physical_limits, client_understands_furniture_is_used, client_understands_furniture_must_be_moved_within_48hrs, agency_billing_id, who_paying_for_appointment, if_other_who_paying_appointment, who_paying_for_delivery, if_other_who_paying_delivery, what_floor_does_client_live_on, elevator_in_building, additional_notes, used_beds_needed, new_beds_and_frames_needed, who_paying_for_new_beds_and_frames, if_other_who_paying_new_items, agency_tax_exempt, new_twin_mattress_and_box_spring, new_full_mattress_and_box_spring, new_queen_mattress_and_box_spring, new_twin_full_bed_frame, new_queen_king_bed_frame, client_approves_speaking_with_staff, if_yes_client_email_or_phone) {

  return pool.connect().then(function(client) {
    return client.query('INSERT INTO "clients" ("first", "last", "dob", "race_ethnicity_id", "street", "city", "state", "zip_code", "county", "building_access_code", "primary_phone", "alternate_phone", "email", "used_bridging_services_previously", "marital_status", "sex", "age", "household_size", "age_of_others_in_household", "num_children_17_and_under", "num_bedrooms", "home_visit_completed", "completed_client_checklist", "yearly_income", "was_client_homeless", "how_long_homeless", "what_brought_client_to_bridging", "will_bring_interpreter", "will_bring_assistant_due_to_mental_health_or_physical_limits", "client_understands_furniture_is_used", "client_understands_furniture_must_be_moved_within_48hrs", "agency_billing_id", "who_paying_for_appointment", "if_other_who_paying_appointment", "who_paying_for_delivery", "if_other_who_paying_delivery", "what_floor_does_client_live_on", "elevator_in_building", "additional_notes", "used_beds_needed", "new_beds_and_frames_needed", "who_paying_for_new_beds_and_frames", "if_other_who_paying_new_items", "agency_tax_exempt", "new_twin_mattress_and_box_spring", "new_full_mattress_and_box_spring", "new_queen_mattress_and_box_spring", "new_twin_full_bed_frame", "new_queen_king_bed_frame", "client_approves_speaking_with_staff", "if_yes_client_email_or_phone") ' +
    'VALUES ($1, $2, $3, ' +
    '(SELECT "id" FROM "race_ethnicity" WHERE "race_ethnicity" = $4),' +
    '$5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51) RETURNING "id"',
    [first, last, dob, race_ethnicity, street, city, state, zip_code, county, building_access_code, primary_phone, alternate_phone, email, used_bridging_services_previously, marital_status, sex, age, household_size, age_of_others_in_household, num_children_17_and_under, num_bedrooms, home_visit_completed, completed_client_checklist, yearly_income, was_client_homeless, how_long_homeless, what_brought_client_to_bridging, will_bring_interpreter, will_bring_assistant_due_to_mental_health_or_physical_limits, client_understands_furniture_is_used, client_understands_furniture_must_be_moved_within_48hrs, agency_billing_id, who_paying_for_appointment, if_other_who_paying_appointment, who_paying_for_delivery, if_other_who_paying_delivery, what_floor_does_client_live_on, elevator_in_building, additional_notes, used_beds_needed, new_beds_and_frames_needed, who_paying_for_new_beds_and_frames, if_other_who_paying_new_items, agency_tax_exempt, new_twin_mattress_and_box_spring, new_full_mattress_and_box_spring, new_queen_mattress_and_box_spring, new_twin_full_bed_frame, new_queen_king_bed_frame, client_approves_speaking_with_staff, if_yes_client_email_or_phone])
>>>>>>> 429b57ac505eceff574900302d419035c616f8ed
    .then(function(result) {
      db.release();
      return result.rows[0];
    })
    .catch(function(error) {
      db.release();
      console.error('query error', error.message, error.stack);
      return error;
    });
  });
}

/**
  * @api {post} /clients/:client_id Get All Info for a Client
  * @apiVersion 0.1.1
  * @apiName GetClient
  * @apiGroup Clients
  * @apiDescription Returns all info from client referral form for a particular client

  * @apiSuccess {Number} id   Unique ID of client
  * @apiSuccess {String} first   First name of client
  * @apiSuccess {String} last   Last name of client
  * @apiSuccess {Date} dob  Client date of birth
  * @apiSuccess {String} race_ethnicity   Client race or ethnicity.
      Options: "African", "American Indian or Alaska Native",
      "Asian or Pacific Islander", "Black or African American", "Hispanic",
      "Mixed Racial Background", "White", "Other"
  * @apiSuccess {String} street   Street address of client
  * @apiSuccess {String} city   City of client address
  * @apiSuccess {String} state  State of client address (2-letter abbreviation)
  * @apiSuccess {String} zip_code   Client zip code

  * @apiErrorExample {json} Post error
  *    HTTP/1.1 500 Internal Server Error
*/
router.get('/:client_id', function(req, res) {
  var client_id = req.params.client_id;
  pool.connect(function(connectionError, db, done) {
    if (connectionError) {
      console.log(connectionError, 'ERROR CONNECTING TO DATABASE');
      res.sendStatus(500);
    } else {
      db.query('SELECT * FROM "clients" WHERE "id" = $1',
      [client_id],
      function(queryError, result){
        done();
        if (queryError) {
          console.log('ERROR MAKING QUERY');
          res.sendStatus(500);
        } else {
          var clientObj = formatClient(result.rows);
          console.log('THIS SHOULD SAY CLIENT_ID', clientObj);
          res.send(clientObj);
        }
      });
    }
  });
});

/**
  * @api {put} /clients Update client
  * @apiVersion 0.1.0
  * @apiName UpdateClient
  * @apiGroup Clients
  * @apiDescription Changes specified properties for a client and changes them to new values

  * @apiParam {Number} client_id  Unique ID of client
  * @apiParam {String} first   First name of client
  * @apiParam {String} last   Last name of client
  * @apiParam {Date} dob  Client date of birth
  * @apiParam {String} race_ethnicity   Client race or ethnicity.
      Options: "African", "American Indian or Alaska Native",
      "Asian or Pacific Islander", "Black or African American", "Hispanic",
      "Mixed Racial Background", "White", "Other"
  * @apiParam {String} street   Street address of client
  * @apiParam {String} city   City of client address
  * @apiParam {String} state  State of client address (2-letter abbreviation)
  * @apiParam {String} zip_code   Client zip code
  *
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  * @apiErrorExample Not found error
  *    HTTP/1.1 404 Not found
*/
router.put('/', function(req, res) {
  var client = req.body;
  console.log('client from other side', client);
  var client_id = client.client_id;
  var first = client.first;
  var last = client.last;
  var dob = formatDateForPostgres(client.dob);
  console.log('new dob', dob);
  var race_ethnicity = client.race_ethnicity;
  var street = client.street;
  var city = client.city;
  var state = client.state;
  var zip_code = client.zip_code;
  pool.connect(function(connectionError, db, done) {
    if (connectionError) {
      console.log(connectionError, 'ERROR CONNECTING TO DATABASE');
      res.sendStatus(500);
    } else {
      db.query('UPDATE "clients"' +
      'SET "first" = $1, "last" = $2, "dob" = $3,' +
      '"race_ethnicity_id" = (SELECT "id" FROM "race_ethnicity" WHERE "race_ethnicity" = $4),' +
      '"street" = $5, "city" = $6, "state" = $7, "zip_code" = $8' +
      'WHERE "id" = $9',
      [first, last, dob, race_ethnicity, street, city, state, zip_code, client_id],
      function(queryError, result){
        done();
        if (queryError) {
          console.log(queryError, 'ERROR MAKING QUERY');
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
});

module.exports = {
  router: router,
  postClient: postClient
};
