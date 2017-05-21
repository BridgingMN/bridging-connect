---- ADD A NEW AGENCY ----
-- Adds a new agency's information to the "agencies" table in the database
INSERT INTO "agencies" ("name", "bridging_agency_id", "primary_first", "primary_last", "primary_job_title", "primary_department", "primary_business_phone", "primary_business_phone_ext", "primary_mobile_phone", "primary_email", "access_disabled", "notes", "beds_allowed_option_id")
VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
(SELECT "id" FROM "beds_allowed_options" WHERE "beds_allowed_option" = $13))
RETURNING "id";
-- $1: name
-- $2: bridging_agency_id
-- $3: primary contact first name
-- $4: primary contact last name
-- $5: primary job title
-- $6: primary department
-- $7: primary contact business phone
-- $8: primary contact business phone extension
-- $9: primary contact mobile phone
-- $10: primary contact email address
-- $11: access_disabled
-- $12: notes
-- $13: beds_allowed_option

---- DELETE AGENCY ----
-- Deletes specified agency from the database
DELETE FROM "agencies" WHERE "id" = $1;
-- $1: agency_id

---- GET ALL AGENCIES ----
-- Retrieves all agencies high-level information from the "agencies" table of the database
SELECT "name", "id", "bridging_agency_id", "access_disabled" FROM "agencies";

---- GET ONE AGENCY ----
-- Retrieve a specific agency's information from the "agencies" table of the database
SELECT "name", "id", "bridging_agency_id", "primary_first", "primary_last", "primary_business_phone", "primary_business_phone", "primary_business_phone_ext", "primary_mobile_phone", "primary_email", "beds_allowed_option_id", "access_disabled"
FROM "agencies"
WHERE "id" = $1;
--$1: agency_id

---- UPDATE AGENCY ----
UPDATE "agencies"
SET ("name", "bridging_agency_id", "primary_first", "primary_last", "primary_job_title", "primary_department", "primary_business_phone", "primary_business_phone_ext", "primary_mobile_phone", "primary_email", "access_disabled", "notes", "beds_allowed_option_id") =
($2, $3, 4, $5, $6, $7, $8, $9, $10, $11, $12, $13, (SELECT "id" FROM "beds_allowed_options" WHERE "beds_allowed_option" = $14))
WHERE "id" = $1;
-- $1: id
-- $2: name
-- $3: bridging_agency_id
-- $4: primary contact first name
-- $5: primary contact last name
-- $6: primary job title
-- $7: primary department
-- $8: primary contact business phone
-- $9: primary contact business phone extension
-- $10: primary contact mobile phone
-- $11: primary contact email address
-- $12: access_disabled
-- $13: notes
-- $14: beds_allowed_option

---- GET USER APPOINTMENTS ----
-- Get all appointments for a user from their user_id
SELECT "appointments"."id", "clients"."first", "clients"."last", "clients"."street", "clients"."city", "clients"."state", "appointments"."confirmation_id", "appointment_slots"."start_time", "appointment_slots"."end_time", "appointment_types"."appointment_type", "locations"."location", "locations"."street", "locations"."city", "locations"."state", "appointments"."appointment_date"
FROM "appointments"
JOIN "clients" ON "appointments"."client_id" = "clients"."id"
JOIN "appointment_slots" ON "appointments"."appointment_slot_id" = "appointment_slots"."id"
JOIN "appointment_types" ON "appointment_slots"."appointment_type_id" = "appointment_types"."id"
JOIN "locations" ON "appointment_slots"."location_id" = "locations"."id"
WHERE "appointments"."user_id" = $1
ORDER BY "appointments"."appointment_date" ASC;
-- $1: user_id

---- GET AVAILABLE APPOINTMENTS ----
-- Get all appointment slots by appointment_type, delivery_method, and location_id
SELECT "appointment_slots"."id", "appointment_slots"."num_allowed", "appointment_slots"."start_time", "appointment_slots"."end_time", "locations"."location", "locations"."street", "locations"."city", "locations"."state", "appointment_types"."appointment_type", "delivery_methods"."delivery_method", "days"."name"
FROM "appointment_slots"
JOIN "locations" ON "appointment_slots"."location_id" = "locations"."id"
JOIN "delivery_methods" ON "appointment_slots"."delivery_method_id" = "delivery_methods"."id"
JOIN "appointment_types" ON "appointment_slots"."appointment_type_id" = "appointment_types"."id"
JOIN "days" ON "appointment_slots"."day_id" = "days"."id"
WHERE "appointment_types"."appointment_type" = $1
AND "delivery_methods"."delivery_method" = $2
AND "locations"."id" = $3
-- $1: appointment_type
-- $2: delivery_method
-- $3: location_id

-- Get count of existing appointments for each date & appointment slot
SELECT "appointments"."appointment_date", COUNT(*)
FROM "appointments"
JOIN "appointment_slots" ON "appointments"."appointment_slot_id" = "appointment_slots"."id"
JOIN "days" ON "appointment_slots"."day_id" = "days"."id"
WHERE "appointments"."appointment_slot_id" IN (1,5) -- variable: array of allowed appointment slots
GROUP BY "appointments"."appointment_date"

---- MAKE APPOINTMENT ----
-- Save an appointment to appointments table
INSERT INTO "appointments" ("appointment_slot_id", "user_id", "client_id", "created_date", "appointment_date", "status_id")
VALUES ($1, $2, $3, $4, $5, (SELECT "id" FROM "statuses" WHERE "status" = 'pending')) RETURNING "id";
-- $1: appointment_slot_id
-- $2: user_id
-- $3: client_id
-- $4: created_date
-- $5: appointment_date

---- UPDATE APPOINTMENT STATUS ----
-- Updates status of an appointment in database
UPDATE "appointments" SET "status_id" = (SELECT "id" FROM "statuses" WHERE "status" = $1)
WHERE "id" = $2;
-- $1: status
-- $2: appointment_id

---- ADD A CLIENT ----
-- Save a new client to clients table
INSERT INTO "clients" ("first", "last", "dob", "race_ethnicity_id", "street", "city", "state", "zip_code")
VALUES (
$1, $2, $3,
(SELECT "id" FROM "race_ethnicity" WHERE "race_ethnicity" = $4),
$5, $6, $7, $8) RETURNING "id";
-- $1: first name
-- $2: last name
-- $3: date of birth
-- $4: race_ethnicity
-- $5: street (address)
-- $6: city
-- $7: state (2-letter abbreviation)
-- $8: zip_code

---- UPDATE A CLIENT ----
-- Changes specified properties for a client and changes them to new values
-- NOTE: WILL IT WORK TO INSERT A VARIABLE FOR A COLUMN NAME??
UPDATE "clients" SET $1 = $2 WHERE "id" = $3;
-- $1: key
-- $2: value
-- $3: client_id

---- ADD A NEW CASEWORKER ----
-- Adds a new caseworker's information to the "users" table in the database
INSERT INTO "users" ("agency_id", "first", "last", "day_phone", "ext", "email", "access_disabled", "notes", "user_type_id")
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, (SELECT "id" FROM "user_types" WHERE "user_type" = $9));
-- $1: agency_id
-- $2: first name
-- $3: last name
-- $4: day_phone
-- $5: day phone extension
-- $6: email
-- $7: access_disabled
-- $8: notes
-- $9: user_type

---- DELETE CASEWORKER ----
-- Deletes specified caseworker from the database
DELETE FROM "users" WHERE "id" = $1;
-- $1: user_id

---- GET ALL CASEWORKERS ----
-- Retrieves all caseworkers' high-level information from the database
SELECT "users"."first", "users"."last", "agencies"."name", "agencies"."id", "agencies"."bridging_agency_id", "agencies"."access_disabled", "users"."access_disabled"
FROM "users" JOIN "agencies" ON "users"."agency_id" = "agencies"."id";

---- GET ONE CASEWORKER ----
-- Retrieves a specific caseworker's information from the database
SELECT "users"."first", "users"."last", "users"."day_phone", "users"."ext", "users"."email", "agencies"."name", "agencies"."id", "agencies"."bridging_agency_id", "agencies"."primary_first", "agencies"."primary_last", "agencies"."primary_business_phone", "agencies"."primary_business_phone_ext", "agencies"."primary_mobile_phone", "agencies"."primary_email", "users"."notes", "agencies"."access_disabled", "users"."access_disabled"
FROM "users" JOIN "agencies" ON "users"."agency_id" = "agencies"."id"
WHERE "users"."id" = $1;
-- $1: user_id

---- UPDATE CASEWORKER ----
-- Updates specified properties for a caseworker
UPDATE "users"
SET ("agency_id", "first", "last", "day_phone", "ext", "email", "access_disabled", "notes", "user_type_id") =
($1, $2, $3, $4, $5, $6, $7, $8, (SELECT "id" FROM "user_types" WHERE "user_type" = $9))
WHERE "id" = $10;
-- $1: agency_id
-- $2: first name
-- $3: last name
-- $4: day_phone
-- $5: day phone extension
-- $6: email
-- $7: access_disabled
-- $8: notes
-- $9: user_type
-- $10: user_id

---- GET LOCATIONS FOR ZIP CODE ----
-- Determines which location(s) should be available to a user given the client's ZIP code
SELECT "locations"."location", "locations"."street", "locations"."city", "locations"."state"
FROM "locations" JOIN "zip_codes" ON "locations"."id" = "zip_codes"."location_id"
WHERE "zip_codes"."zip_code" = $1;
-- $1: zip_code (string)

---- ADD APPOINTMENT SLOT ----
-- Save a new appointment slot
INSERT INTO "appointment_slots" ("appointment_type_id", "day_id", "delivery_method_id", "location_id", "start_time", "end_time", "num_allowed")
VALUES ((SELECT "id" FROM "appointment_types" WHERE "appointment_type" = $1),
(SELECT "id" FROM "days" WHERE "name" = $2),
(SELECT "id" FROM "delivery_methods" WHERE "delivery_method" = $3),
(SELECT "id" FROM "locations" WHERE "location" = $4), $5, $6, $7);
-- $1: appointment_type
-- $2: day
-- $3: delivery_method
-- $4: location
-- $5: start_time
-- $6: end_time
-- $7: num_allowed
