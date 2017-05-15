--------CREATE DB & TABLES-------------
-- create "bridging" database
CREATE DATABASE "bridging";

-- create "users" table
CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR(120) NOT NULL UNIQUE,
  "password" VARCHAR(120) NOT NULL
);