/*  Module to delete appointment & client data from database that are older than
    a specified time interval
**/

// CONSTANTS
/*  Together, intervalLength & intervalType define the time interval before
    which data should not be kept (e.g., when INTERVAL_LENGTH = 6 and
    INTERVAL_TYPE = 'months', data from more than 6 months ago will be deleted)
**/
const INTERVAL_LENGTH = 6;
const INTERVAL_TYPE = 'months';

/*  The hour & minute upon which daily deletion should happen, e.g. if DELETION_HOUR
    is 0 & DELETION_MINUTE is 0, the deletion function will run at midnight
**/
const DELETION_HOUR = 0;
const DELETION_MINUTE = 0;

var schedule = require('node-schedule');
var moment = require('moment');

var formatDateForPostgres = require('../modules/formatters').formatDateForPostgres;

// DATABASE MODULE
var pool = require('../modules/database.js');

// configure recurrence of scheduled deletion
var rule = new schedule.RecurrenceRule();
rule.hour = DELETION_HOUR;
rule.minute = DELETION_MINUTE;

// schedule the function deleteOldData to run according to the rule configured above
schedule.scheduleJob(rule, deleteOldData);

// deletes appointments & clients from database that are older than the interval specified (in months)
// intervalLength is an integer
// intervalUnit is a string ('years', 'quarters', 'months', 'weeks', or 'days')
function deleteOldData() {
  console.log('deleting old data...');
  console.log('time:', new Date());
  var cutoffDate = moment().subtract(INTERVAL_LENGTH, INTERVAL_TYPE);
  cutoffDate = formatDateForPostgres(cutoffDate);
  console.log('cut off date:', cutoffDate);
  deleteApptsBefore(cutoffDate)
  .then(function(rows) {
    var clientIds = getClientIds(rows);
    deleteClients(clientIds);
  })
  .catch(function(error) {
    console.log(error);
  });
}

// deletes appointments whose appointment_date is before a certain date
// date parameter is a string in format 'YYYY-MM-DD'
function deleteApptsBefore(date) {
  return pool.connect().then(function(client) {
    return client.query(
      'DELETE FROM "appointments" WHERE ("appointment_date" < $1::DATE) RETURNING *',
      [date]
    )
    .then(function(result) {
      client.release();
      console.log('deleted appt count:', result.rowCount, '\n', 'deleted appts:', result.rows);
      return result.rows;
    })
    .catch(function(error) {
      client.release();
      console.error('query error', error.message, error.stack);
    });
  });
}

// takes in an array of IDs and deletes client matching each id in array
function deleteClients(clientIds) {
  return pool.connect().then(function(client) {
    return client.query(
      'DELETE FROM "clients" WHERE ("id" = ANY($1::int[])) RETURNING *',
      [clientIds]
    )
    .then(function(result) {
      client.release();
      console.log('deleted client count:', result.rowCount, '\n', 'deleted clients:', result.rows);
      return result.rows;
    })
    .catch(function(error) {
      client.release();
      console.error('query error', error.message, error.stack);
    });
  });
}

// takes an array of rows from the appointments table of DB
// returns array of IDs of the clients associated with those appointments
function getClientIds(rows) {
  var clientIds = [];
  for (var i = 0; i < rows.length; i++) {
    var clientId = rows[i].client_id;
    clientIds.push(clientId);
  }
  return clientIds;
}

module.exports = schedule;
