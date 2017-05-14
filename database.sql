
--------CREATE DB & TABLES-------------
-- create "bridging" database
CREATE DATABASE "Bridging";

-- TODO: create "Clients" table

-- create "User_types" table
CREATE TABLE IF NOT EXISTS "User_types" (
  id SERIAL PRIMARY KEY,
  user_type VARCHAR(40) NOT NULL UNIQUE
);

-- create "Beds_allowed_options" table
-- refers to whether or not the agency is allowed to purchase new beds
CREATE TABLE IF NOT EXISTS "Beds_allowed_options" (
  id SERIAL PRIMARY KEY,
  beds_allowed_option VARCHAR(40) NOT NULL UNIQUE
);

-- create "Agencies" table
-- bridging_agency_id is the ID assigned to the agency in Bridging's Access database
CREATE TABLE IF NOT EXISTS "Agencies" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  beds_allowed_option_id INTEGER,
  bridging_agency_id INTEGER
);

-- create "Users" table
CREATE TABLE IF NOT EXISTS "Users" (
  id SERIAL PRIMARY KEY,
  user_type_id INTEGER NOT NULL REFERENCES "User_types",
  agency_id INTEGER NOT NULL REFERENCES "Agencies",
  email VARCHAR(120) NOT NULL UNIQUE,
  first VARCHAR(40) NOT NULL,
  last VARCHAR(40) NOT NULL,
  password VARCHAR(120) NOT NULL,
  phone INTEGER,
  ext INTEGER
);

-- create "Statuses" table
-- refers to status of appt (confirmed, pending, canceled)
CREATE TABLE IF NOT EXISTS "Statuses" (
  id SERIAL PRIMARY KEY,
  status VARCHAR(20) NOT NULL UNIQUE
);

-- create "Appt_types" table
-- refers to type of appointment--currently shopping or new bed
CREATE TABLE IF NOT EXISTS "Appt_types" (
  id SERIAL PRIMARY KEY,
  appt_type VARCHAR(40) NOT NULL UNIQUE
);

-- create "Days" table
-- contains names of days of week
CREATE TABLE IF NOT EXISTS "Days" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(10) NOT NULL UNIQUE
);

-- create "Delivery_methods" table
-- currently options are pickup or delivery
CREATE TABLE IF NOT EXISTS "Delivery_methods" (
  id SERIAL PRIMARY KEY,
  delivery_method VARCHAR(20) NOT NULL UNIQUE
);

-- create "Locations" table
-- currently options will be Bloomington and Roseville
CREATE TABLE IF NOT EXISTS "Locations" (
  id SERIAL PRIMARY KEY,
  location VARCHAR(50) NOT NULL UNIQUE
);

-- create "Appt_slots" table
-- refers to a default timeslot (with a certain number of appointments available)
-- within that timeslot) in Bridging's repeating schedule
CREATE TABLE IF NOT EXISTS "Appt_slots" (
  id SERIAL PRIMARY KEY,
  appt_type_id INTEGER NOT NULL REFERENCES "Appt_types",
  day_id INTEGER NOT NULL REFERENCES "Days",
  delivery_method_id INTEGER NOT NULL REFERENCES "Delivery_methods",
  location_id INTEGER NOT NULL REFERENCES "Locations",
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  num_avail INTEGER
);

-- create "Overrides" table
-- stores one-off changes to default schedule
CREATE TABLE IF NOT EXISTS "Overrides" (
  id SERIAL PRIMARY KEY,
  appt_type_id INTEGER NOT NULL REFERENCES "Appt_types",
  delivery_method_id INTEGER NOT NULL REFERENCES "Delivery_methods",
  location_id INTEGER NOT NULL REFERENCES "Locations",
  override_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  num_avail INTEGER
);

-- create "Appts" table
-- refers to a single appointment that has been made by a caseworker
CREATE TABLE IF NOT EXISTS "Appts" (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES "Users",
  client_id INTEGER NOT NULL,
  status_id INTEGER NOT NULL REFERENCES "Statuses",
  appt_slot_id INTEGER NOT NULL REFERENCES "Appt_slots",
  appt_date DATE NOT NULL,
  delivery_date DATE
);

-- create "Zip_codes" table
CREATE TABLE IF NOT EXISTS "Zip_codes" (
  id SERIAL PRIMARY KEY,
  location_id INTEGER NOT NULL REFERENCES "Locations",
  zip_code VARCHAR(10) NOT NULL,
  zone_id INTEGER NOT NULL REFERENCES "Zones"
);

CREATE TABLE IF NOT EXISTS "Zones" (
  id SERIAL PRIMARY KEY,
  zone INTEGER NOT NULL
)

-- create "Race_ethnicity" table
CREATE TABLE IF NOT EXISTS "Race_ethnicity" (
  id SERIAL PRIMARY KEY,
  race_ethnicity VARCHAR(50) NOT NULL UNIQUE
);

--------INSERT STATIC DATA INTO TABLES-------------

-- add data to "User_types" table
INSERT INTO "User_types" ("user_type") VALUES ('admin'), ('caseworker');

-- add data to "Beds_allowed_options" table
INSERT INTO "Beds_allowed_options" ("beds_allowed_option") VALUES ('yes'), ('no'), ('check');

-- add data to "Appt_types" table
INSERT INTO "Appt_types" ("appt_type") VALUES ('shopping'), ('new bed');

-- add data to "Delivery_methods" table
INSERT INTO "Delivery_methods" ("delivery_method") VALUES ('pickup'), ('delivery');

-- add data to "Days" table
INSERT INTO "Days" ("name") VALUES ('Sunday'), ('Monday'), ('Tuesday'), ('Wednesday'),
('Thursday'), ('Friday'), ('Saturday');

-- add data to "Statuses" table
INSERT INTO "Statuses" ("status") VALUES ('confirmed'), ('pending'), ('canceled');

-- add data to "Locations" table
INSERT INTO "Locations" ("location") VALUES ('Bloomington'), ('Roseville');

-- add data to "Race_ethnicity" table
INSERT INTO "Race_ethnicity" ("race_ethnicity") VALUES ('African'),
('American Indian or Alaska Native'), ('Asian or Pacific Islander'),
('Black or African American'), ('Hispanic'), ('Mixed Racial Background'),
('White'), ('Other');

-- add data to "Zip_codes" table
-- INSERT INTO "Zip_codes" ("zip_code", "zone_id", "location_id") VALUES ('<zip code>', '<zone_id>', '<location_id>');
INSERT INTO "Zip_codes" ("zip_code", "zone_id", "location_id") VALUES ('55001', '1', '1'),
('55016', '1', '1'), ('55024', '1', '1'), ('55033', '1', '1'), ('55043', '1', '1'),
('55044', '1', '1'), ('55055', '1', '1'), ('55068', '1', '1'), ('55071', '1', '1'),
('55076', '1', '1'), ('55077', '1', '1'), ('55120', '1', '1'), ('55121', '1', '1'),
('55122', '1', '1'), ('55123', '1', '1'), ('55124', '1', '1'), ('55125', '1', '1'),
('55129', '1', '1'), ('55306', '1', '1'), ('55337', '1', '1'), ('55317', '2', '1'),
('55318', '2', '1'), ('55322', '2', '1'), ('55331', '2', '1'), ('55372', '2', '1'),
('55375', '2', '1'), ('55378', '2', '1'), ('55379', '2', '1'), ('55386', '2', '1'),
('55387', '2', '1'), ('55311', '3', '1'), ('55340', '3', '1'), ('55356', '3', '1'),
('55359', '3', '1'), ('55364', '3', '1'), ('55369', '3', '1'), ('55374', '3', '1'),
('55384', '3', '1'), ('55391', '3', '1'), ('55411', '3', '1'), ('55412', '3', '1'),
('55422', '3', '1'), ('55427', '3', '1'), ('55428', '3', '1'), ('55441', '3', '1'),
('55442', '3', '1'), ('55446', '3', '1'), ('55447', '3', '1'), ('55111', '4', '1'),
('55305', '4', '1'), ('55343', '4', '1'), ('55344', '4', '1'), ('55345', '4', '1'),
('55346', '4', '1'), ('55347', '4', '1'), ('55403', '4', '1'), ('55404', '4', '1'),
('55405', '4', '1'), ('55406', '4', '1'), ('55407', '4', '1'), ('55408', '4', '1'),
('55409', '4', '1'), ('55410', '4', '1'), ('55416', '4', '1'), ('55417', '4', '1'),
('55419', '4', '1'), ('55420', '4', '1'), ('55423', '4', '1'), ('55424', '4', '1'),
('55425', '4', '1'), ('55426', '4', '1'), ('55431', '4', '1'), ('55435', '4', '1'),
('55436', '4', '1'), ('55437', '4', '1'), ('55438', '4', '1'), ('55439', '4', '1'),
('55454', '4', '1'), ('55005', '5', '2'), ('55011', '5', '2'), ('55014', '5', '2'),
('55070', '5', '2'), ('55092', '5', '2'), ('55303', '5', '2'), ('55304', '5', '2'),
('55316', '5', '2'), ('55433', '5', '2'), ('55434', '5', '2'), ('55443', '5', '2'),
('55444', '5', '2'), ('55445', '5', '2'), ('55448', '5', '2'), ('55449', '5', '2'),
('55025', '6', '2'), ('55038', '6', '2'), ('55042', '6', '2'), ('55047', '6', '2'),
('55073', '6', '2'), ('55082', '6', '2'), ('55109', '6', '2'), ('55110', '6', '2'),
('55115', '6', '2'), ('55119', '6', '2'), ('55128', '6', '2'), ('55075', '7', '2'),
('55101', '7', '2'), ('55102', '7', '2'), ('55103', '7', '2'), ('55104', '7', '2'),
('55105', '7', '2'), ('55106', '7', '2'), ('55107', '7', '2'), ('55108', '7', '2'),
('55112', '7', '2'), ('55113', '7', '2'), ('55114', '7', '2'), ('55116', '7', '2'),
('55117', '7', '2'), ('55118', '7', '2'), ('55126', '7', '2'), ('55127', '7', '2'),
('55130', '7', '2'), ('55155', '7', '2'), ('55401', '7', '2'), ('55402', '7', '2'),
('55413', '7', '2'), ('55414', '7', '2'), ('55415', '7', '2'), ('55418', '7', '2'),
('55421', '7', '2'), ('55429', '7', '2'), ('55430', '7', '2'), ('55432', '7', '2'),
('55455', '7', '2');

-- TODO: add data to "Zones" table
-- INSERT INTO "Zones" ("zone") VALUES ("<zone>");
