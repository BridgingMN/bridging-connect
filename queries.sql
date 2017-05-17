---- GET USER APPOINTMENTS ----
-- Get all appointments for a user from their user_id
SELECT "appointments"."id", "clients"."first", "clients"."last", "clients"."street", "clients"."city", "clients"."state", "appointments"."confirmation_id", "appointment_slots"."start_time", "appointment_slots"."end_time", "appointment_types"."appointment_type", "locations"."location", "locations"."street", "locations"."city", "locations"."state", "appointments"."appointment_date"
FROM "appointments"
JOIN "clients" ON "appointments"."client_id" = "clients"."id"
JOIN "appointment_slots" ON "appointments"."appointment_slot_id" = "appointment_slots"."id"
JOIN "appointment_types" ON "appointment_slots"."appointment_type_id" = "appointment_types"."id"
JOIN "locations" ON "appointment_slots"."location_id" = "locations"."id"
WHERE "appointments"."user_id" = 'USER_ID' -- change this
ORDER BY "appointments"."appointment_date" ASC;

---- GET AVAILABLE APPOINTMENTS ----
-- Get all appointment slots by appointment_type, delivery_method, and location_id
SELECT "appointment_slots"."id", "appointment_slots"."num_allowed", "appointment_slots"."start_time", "appointment_slots"."end_time", "locations"."location", "locations"."street", "locations"."city", "locations"."state", "appointment_types"."appointment_type", "delivery_methods"."delivery_method", "days"."name"
FROM "appointment_slots"
JOIN "locations" ON "appointment_slots"."location_id" = "locations"."id"
JOIN "delivery_methods" ON "appointment_slots"."delivery_method_id" = "delivery_methods"."id"
JOIN "appointment_types" ON "appointment_slots"."appointment_type_id" = "appointment_types"."id"
JOIN "days" ON "appointment_slots"."day_id" = "days"."id"
WHERE "appointment_types"."appointment_type" = 'shopping'
AND "delivery_methods"."delivery_method" = 'delivery'
AND "locations"."id" = 1;

-- Get count of existing appointments for each date & appointment slot
SELECT "appointments"."appointment_date", COUNT(*)
FROM "appointments"
JOIN "appointment_slots" ON "appointments"."appointment_slot_id" = "appointment_slots"."id"
JOIN "days" ON "appointment_slots"."day_id" = "days"."id"
WHERE "appointments"."appointment_slot_id" IN (1,5) -- change this (array of allowed appointment slots)
GROUP BY "appointments"."appointment_date"

---- MAKE APPOINTMENT ----
-- Save an appointment to appointments table
INSERT INTO "appointments" ("appointment_slot_id", "user_id", "client_id", "created_date", "status_id",  "appointment_date")
VALUES (
1, -- change this (appointment slot id)
1, -- change this (user_id)
1, -- change this (client_id)
'May 15, 2017', -- change this (created date)
(SELECT "id" FROM "statuses" WHERE "status" = 'pending'),
'June 20, 2017'); -- change this (appointment date)

---- ADD A CLIENT ----
-- Save a new client to clients table
INSERT INTO "clients" ("first", "last", "dob", "race_ethnicity_id", "street", "city", "state", "zip_code")
VALUES (
'Liz', -- change this (first name)
'Fakington',  -- change this (last name)
'5/6/69',  -- change this (date of birth)
(SELECT "id" FROM "race_ethnicity" WHERE 'race_ethnicity' = 'African'), -- variable: race_ethnicity
'333 Lil Sebastian Lane', -- variable: street
'Ham Lake', -- variable: city
'MN', -- variable: state
55101); -- variable: zip_code

---- [NAME OF ADMIN CREATE APPOINTMENT SLOT ROUTE] ----
-- Save a new appointment slot
INSERT INTO "appointment_slots" ("appointment_type_id", "day_id", "delivery_method_id", "location_id", "start_time", "end_time", "num_allowed")
VALUES (
(SELECT "id" FROM "appointment_types" WHERE "appointment_type" = 'shopping'), -- change this
(SELECT "id" FROM "days" WHERE "name" = 'Sunday'), -- change this
(SELECT "id" FROM "delivery_methods" WHERE "delivery_method" = 'pickup'), -- change this
(SELECT "id" FROM "locations" WHERE "location" = 'Bloomington'), -- change this
'10:15', -- change this (& put in correct format
'11:15', -- change this (& put in correct format
3); -- change this (num_allowed)

--- [NAME OF CREATE NEW CASEWORKER ROUTE] ----
-- Save a new caseworker
INSERT INTO "users" ("user_type_id", "agency_id", "email", "first", "last", "day_phone", "street", "city", "state", "zip_code", "department")
VALUES (
(SELECT "id" FROM "user_types" WHERE "user_type" = 'caseworker'),
(SELECT "id" FROM "agencies" WHERE "name" = 'American Indian Family Center'), -- variable: agency name
'fake@superfake.com', -- variable: email address of caseworker
'Arthur', -- variable: caseworker first name
'Weasley', -- variable: caseworker last name
'888-888-8888', -- variable: day phone number for caseworker
'1111 Lemon Ave', -- variable: case worker street address (of agency? is this needed?)
'Bloomington', -- variable: case worker city (of agency? is this needed?)
'MN', -- variable: case worker state (of agency? is this needed?)
'55404', -- variable: case worker zip (of agency? is this needed?)
'Department of Magical Inquiry'); -- variable: case worker department name
