// VENDOR MODULES
var moment = require('moment');
var Promise = require('bluebird');

// DATABASE MODULE
var pool = require('../modules/database.js'); // has been promisified with Bluebird

// CUSTOM MODULES
var formatters = require('./formatters.js');
var formatDate = formatters.formatDate;
var formatTime = formatters.formatTime;

// MAIN FUNCTION
/**
  * Gets appointment objects that match the parameters and still have available spots left
  * @param {String} appointmentType - the type of appointment
  * @param {String} deliveryMethod - the method by which items will be delivered
  * @param {Number} locationId - ID of location of appointment in DB
  * @param {String} minDate - inclusive lower bound of date range, formatted as 'YYYY-MM-DD'
  * @param {String} maxDate - inclusive upper bound of date range, formatted as 'YYYY-MM-DD'
  * @returns {Array<object>} - array of appointment objects corresponding to appointment
    slots that are not yet full
*/
function getAvailableAppointments(appointmentType, deliveryMethod, locationId, minDate, maxDate) {
  var appointmentSlots, appointmentSlotIds, existingAppointmentCounts, appointmentOverrides;

  return new Promise(function(resolve, reject) {
    // Retrieve array of relevant appointment slots
    getAppointmentSlots(appointmentType, deliveryMethod, locationId)

    .then(function(result){
      appointmentSlots = result;
      appointmentSlotIds = createArrayFromProperty(appointmentSlots, 'appointment_slot_id');

      return Promise.all([
        countExistingAppointments(appointmentSlotIds, minDate, maxDate),
        getOverrides(appointmentSlotIds, minDate, maxDate)
      ]);
    })

    .then(function([counts, overrides]){
      existingAppointmentCounts = counts;
      appointmentOverrides = overrides;
      return fillOutDateRange(minDate, maxDate, appointmentSlots, existingAppointmentCounts, appointmentOverrides);
    })

    .then(function(result){
      resolve(result);
    })

    .catch(function(error){
      reject(error);
    });
  });
}

// QUERY FUNCTIONS
/**
  * Finds appointment slots in database that match the provided parameters
  * @param {String} appointmentType - the type of appointment
  * @param {String} deliveryMethod - the method by which items will be delivered
  * @param {Number} locationId - ID of location of appointment in DB
  * @returns {Array<object>} - array of appointment slot objects from DB
*/
function getAppointmentSlots(appointmentType, deliveryMethod, locationId) {
  return pool.connect().then(function(client) {
    return client.query(
      'SELECT "appointment_slots"."id" AS "appointment_slot_id", "appointment_slots"."num_allowed",' +
      '"appointment_slots"."start_time", "appointment_slots"."end_time",' +
      '"locations"."location" AS "location_name", "locations"."street", "locations"."city",' +
      '"locations"."state", "appointment_types"."appointment_type",' +
      '"delivery_methods"."delivery_method", "days"."name" AS "day" FROM "appointment_slots"' +
      'JOIN "locations" ON "appointment_slots"."location_id" = "locations"."id"' +
      'JOIN "delivery_methods" ON "appointment_slots"."delivery_method_id" = "delivery_methods"."id"' +
      'JOIN "appointment_types" ON "appointment_slots"."appointment_type_id" = "appointment_types"."id"' +
      'JOIN "days" ON "appointment_slots"."day_id" = "days"."id"' +
      'WHERE "appointment_types"."appointment_type" = $1' +
      'AND "delivery_methods"."delivery_method" = $2' +
      'AND "locations"."id" = $3',
      [appointmentType, deliveryMethod, locationId]
    )
    .then(function(result) {
      client.release();
      return result.rows;
    })
    .catch(function(error) {
      client.release();
      console.error('query error', error.message, error.stack);
    });
  });
}

/**
  * Retrieves counts of appointments that have already been made for each
    of a given set of appointment slots within a given date range
  * @param {Number[]} appointmentSlotIds - IDs corresponding to appointment slots in DB
  * @param {String} minDate - inclusive lower bound of date range, formatted as 'YYYY-MM-DD'
  * @param {String} maxDate - inclusive upper bound of date range, formatted as 'YYYY-MM-DD'
  * @returns {Array<object>} - array of objects with count, date, and appointment slot id
*/
function countExistingAppointments(appointmentSlotIds, minDate, maxDate) {
  return pool.connect().then(function(client) {
    return client.query(
      'SELECT "appointments"."appointment_date", "appointment_slots"."id" AS "appointment_slot_id", COUNT(*)' +
      'FROM "appointments"' +
      'JOIN "appointment_slots" ON "appointments"."appointment_slot_id" = "appointment_slots"."id"' +
      'JOIN "days" ON "appointment_slots"."day_id" = "days"."id"' +
      'WHERE "appointments"."appointment_slot_id" = ANY($1::int[])' +
      'AND "appointments"."appointment_date" >= $2' +
      'AND "appointments"."appointment_date" <= $3' +
      'AND ("appointments"."status_id" =' +
      '(SELECT "id" FROM "statuses" WHERE "status" = $4)' +
      'OR "appointments"."status_id" =' +
      '(SELECT "id" FROM "statuses" WHERE "status" = $5))' +
      'GROUP BY "appointments"."appointment_date", "appointment_slots"."id"',
      [appointmentSlotIds, minDate, maxDate, 'pending', 'confirmed']
    )
    .then(function(result){
      client.release();
      return result.rows;
    })
    .catch(function(error) {
      client.release();
      console.error('query error', error.message, error.stack);
    });
  });
}

/**
  * Retrieves entries in overrides table of DB that would change the number of
    appointments allowed for a specific appointment slot on a specific day
  * @param {Array<number>} appointmentSlotIds - IDs corresponding to appointment slots in DB
  * @param {String} minDate - inclusive lower bound of date range, formatted as 'YYYY-MM-DD'
  * @param {String} maxDate - inclusive upper bound of date range, formatted as 'YYYY-MM-DD'
  * @returns {Array<object>} - array of appointment slot objects
*/
function getOverrides(appointmentSlotIds, minDate, maxDate) {
  return pool.connect().then(function(client) {
    return client.query(
      'SELECT "overrides"."appointment_slot_id", "overrides"."num_allowed",' +
      '"appointment_slots"."start_time", "appointment_slots"."end_time",' +
      '"locations"."location" AS "location_name", "locations"."street",' +
      '"locations"."city", "locations"."state", "appointment_types"."appointment_type",' +
      '"delivery_methods"."delivery_method", "days"."name" AS "day", "overrides"."override_date"' +
      'FROM "overrides"' +
      'JOIN "appointment_slots" ON "overrides"."appointment_slot_id" = "appointment_slots"."id"' +
      'JOIN "locations" ON "appointment_slots"."location_id" = "locations"."id"' +
      'JOIN "delivery_methods" ON "appointment_slots"."delivery_method_id" = "delivery_methods"."id"' +
      'JOIN "appointment_types" ON "appointment_slots"."appointment_type_id" = "appointment_types"."id"' +
      'JOIN "days" ON "appointment_slots"."day_id" = "days"."id"' +
      'WHERE "override_date" >= $1' +
      'AND "override_date" <= $2' +
      'AND "overrides"."appointment_slot_id" = ANY($3::int[]);',
      [minDate, maxDate, appointmentSlotIds]
    )
    .then(function(result){
      client.release();
      return result.rows;
    })
    .catch(function(error) {
      client.release();
      console.error('query error', error.message, error.stack);
    });
  });
}

// HELPER FUNCTIONS

/**
  * Generic function to take an array of objects and return a simpler array that
    contains only the values for one property of the object
  * @param {Array<object>} objectArray - an array of objects with at least one shared property
  * @param {String} key - the key for a shared property of the objects
  * @returns {Array} - an array of values corresponding to the key parameter
*/
function createArrayFromProperty(objectArray, key) {
  var newArray = objectArray.map(function(object) {
    return object[key];
  });
  return newArray;
}

function fillOutDateRange(minDate, maxDate, appointmentSlots, existingAppointmentCounts, overrides) {
  var appointmentsAvailable = [];
  var slotsForDate;
  var date = minDate;
  while (date <= maxDate) {
    var overridesForDate = checkForOverrides(date, overrides);
    if(overridesForDate.length > 0) {
      console.log('returned from checkForOverrides:', overridesForDate);
      slotsForDate = overridesForDate;
    } else {
      slotsForDate = findRelevant(appointmentSlots, date);
    }

    for (var i = 0; i < slotsForDate.length; i++) {
      var appointmentSlot;
      var isAvailable = checkAvailability(slotsForDate[i], date, existingAppointmentCounts);
      if (isAvailable){
        appointmentSlot = shallowCopy(slotsForDate[i]);
        appointmentSlot.date = formatDate(date);
        appointmentSlot.start_time = formatTime(slotsForDate[i].start_time);
        appointmentSlot.end_time = formatTime(slotsForDate[i].end_time);
        appointmentsAvailable.push(appointmentSlot);
      }
    }
    date = moment(date).add(1, 'days').format('YYYY-MM-DD');
  }
  return appointmentsAvailable;
}

function findRelevant(appointmentSlots, date) {
  var momentOfDate = moment(date);
  var day = momentOfDate.format('dddd');
  var slotList = appointmentSlots.filter(function(appointmentSlot) {
    return appointmentSlot.day === day;
  });
  return slotList;
}

// checks to see if an appointment slot on a particular date is still available
// (i.e. not completely filled) and returns true if it is
function checkAvailability(appointmentSlot, date, existingAppointmentCounts) {
  if (appointmentSlot.num_allowed < 1) {
    return false;
  }
  for (var i = 0; i < existingAppointmentCounts.length; i++) {
    var appointment = existingAppointmentCounts[i];
    if (
      appointment.appointment_slot_id == appointmentSlot.appointment_slot_id
      && compareDates(appointment.appointment_date, date)
    ) {
      if (appointment.count < appointmentSlot.num_allowed) {
        return true;
      } else {
        return false;
      }
    }
  }
  return true;
}

function compareDates(appointmentDate, date) {
    //Convert date string from appointment object to a Javascript Date;
    appointmentDate = new Date (appointmentDate);
    date = new Date(date);
    var match = appointmentDate.toISOString().substr(0,10) == date.toISOString().substr(0,10);
    return (match);
    //Return a comparison of the two dates.
}

function checkForOverrides(date, overrides) {
  return overrides.filter(function(row) {
    return compareDates(row.override_date, date);
  });
}

function shallowCopy(original) {
    // First create an empty object with
    // same prototype of our original source
    var clone = Object.create(Object.getPrototypeOf(original));
    var i, keys = Object.getOwnPropertyNames(original);
    for (i = 0; i < keys.length; i ++) {
      // copy each property into the clone
        Object.defineProperty(clone, keys[i] ,
            Object.getOwnPropertyDescriptor(original, keys[i])
        );
    }
    return clone;
}

module.exports = getAvailableAppointments;
