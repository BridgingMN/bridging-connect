--------CREATE DB & TABLES-------------
-- create "bridging" database
CREATE DATABASE "Bridging";

-- TODO: create "Clients" table

-- create "Users" table
CREATE TABLE "Users" (
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

-- create "User_types" table
CREATE TABLE "User_types" (
  id SERIAL PRIMARY KEY,
  user_type VARCHAR(40) NOT NULL UNIQUE
);

-- create "Agencies" table
-- bridging_agency_id is the ID assigned to the agency in Bridging's Access database
CREATE TABLE "Agencies" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  beds_ok_status_id INTEGER,
  bridging_agency_id INTEGER
);

-- create "Beds_ok_statuses" table
-- refers to whether or not the agency is allowed to purchase new beds
CREATE TABLE "Beds_ok_statuses" (
  id SERIAL PRIMARY KEY,
  beds_ok_status VARCHAR(40) NOT NULL UNIQUE
);

-- create "Appts" table
-- refers to a single appointment that has been made by a caseworker
CREATE TABLE "Appts" (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  client_id INTEGER NOT NULL,
  status_id INTEGER NOT NULL,
  appt_slot_id INTEGER NOT NULL,
  delivery_method_id INTEGER NOT NULL,
  appt_date DATE NOT NULL,
  delivery_date DATE
);

-- create "Appt_types" table
-- refers to type of appointment--currently shopping or new bed
CREATE TABLE "Appt_types" (
  id SERIAL PRIMARY KEY,
  appt_type VARCHAR(40) NOT NULL UNIQUE
);

-- create "Appt_slots" table
-- refers to a default timeslot (with a certain number of appointments available)
-- within that timeslot) in Bridging's repeating schedule
CREATE TABLE "Appt_slots" (
  id SERIAL PRIMARY KEY,
  appt_type_id INTEGER NOT NULL,
  day_id INTEGER NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  num_avail INTEGER
);

-- create "Delivery_methods" table
-- currently options are pickup or delivery
CREATE TABLE "Delivery_methods" (
  id SERIAL PRIMARY KEY,
  delivery_method VARCHAR(20) NOT NULL UNIQUE
);

-- create "Day" table
-- contains names of days of week
CREATE TABLE "Day" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(10) NOT NULL UNIQUE
);

-- create "Status" table
-- refers to status of appt (confirmed, pending, canceled)
CREATE TABLE "Status" (
  id SERIAL PRIMARY KEY,
  status VARCHAR(20) NOT NULL UNIQUE
);

-- create "Location" table
-- currently options will be Bloomington and Roseville
CREATE TABLE "Location" (
  id SERIAL PRIMARY KEY,
  location VARCHAR(50) NOT NULL UNIQUE
);

-- create "Zip_codes" table
CREATE TABLE "Zip_codes" (
  id SERIAL PRIMARY KEY,
  location_id INTEGER NOT NULL,
  zip_code VARCHAR(10) NOT NULL
)

--
