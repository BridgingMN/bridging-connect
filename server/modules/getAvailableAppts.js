var moment = require('moment');
var pool = require('../modules/database.js');
var Promise = require('bluebird');
var formatters = require('./formatters.js');
var formatDate = formatters.formatDate;
var formatTime = formatters.formatTime;

function getAvailableAppts(appointmentType, deliveryMethod, locationId, minDate, maxDate) {
  var apptSlots, apptSlotIds, existingApptCounts, overrides;

  return new Promise(function(resolve, reject) {
    getApptSlots(appointmentType, deliveryMethod, locationId)
    .then(function(result){
      apptSlots = result.rows;
      apptSlotIds = apptSlots.map(function(apptSlot) {
        return apptSlot.appointment_slot_id;
      });

      return Promise.all([
        countExistingAppts(apptSlotIds, minDate, maxDate),
        getOverrides(minDate, maxDate, apptSlotIds)
      ]);
    })
    .then(function(result){
      existingApptCounts = result[0].rows;
      overrides = result[1].rows;
      return fillOutDateRange(minDate, maxDate, apptSlots, existingApptCounts, overrides);
    })
    .then(function(result){
      resolve(result);
    })
    .catch(function(error){
      reject(error);
    });
  });
}

function getApptSlots(appointmentType, deliveryMethod, locationId) {
  return pool.connect().then(function(client, done) {
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
    );
  });
}

// apptSlotIds is an array of appointment_slot_ids
// minDate & maxDate are dates that act as inclusive bounds of the date range to be searched
function countExistingAppts(apptSlotIds, minDate, maxDate) {
  return pool.connect().then(function(client, done) {
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
      [apptSlotIds, minDate, maxDate, 'pending', 'confirmed']
    );
  });
}

function getOverrides(minDate, maxDate, apptSlotIds) {
  return pool.connect().then(function(client, done) {
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
      [minDate, maxDate, apptSlotIds]
    );
  });
}

function fillOutDateRange(minDate, maxDate, apptSlots, existingApptCounts, overrides) {
  var apptsAvailable = [];
  var slotsForDate;
  var date = minDate;
  while (date <= maxDate) {
    var overridesForDate = checkForOverrides(date, overrides);
    if(overridesForDate.length > 0) {
      console.log('returned from checkForOverrides:', overridesForDate);
      slotsForDate = overridesForDate;
    } else {
      slotsForDate = findRelevant(apptSlots, date);
    }

    for (var i = 0; i < slotsForDate.length; i++) {
      var apptSlot;
      var isAvailable = checkAvailability(slotsForDate[i], date, existingApptCounts);
      if (isAvailable){
        apptSlot = shallowCopy(slotsForDate[i]);
        apptSlot.date = formatDate(date);
        apptSlot.start_time = formatTime(slotsForDate[i].start_time);
        apptSlot.end_time = formatTime(slotsForDate[i].end_time);
        apptsAvailable.push(apptSlot);
      }
    }
    date = moment(date).add(1, 'days').format('YYYY-MM-DD');
  }
  return apptsAvailable;
}

function findRelevant(apptSlots, date) {
  var momentOfDate = moment(date);
  var day = momentOfDate.format('dddd');
  var slotList = apptSlots.filter(function(apptSlot) {
    return apptSlot.day === day;
  });
  return slotList;
}

// checks to see if an appt slot on a particular date is still available
// (i.e. not completely filled) and returns true if it is
function checkAvailability(apptSlot, date, existingApptCounts) {
  if (apptSlot.num_allowed < 1) {
    return false;
  }
  for (var i = 0; i < existingApptCounts.length; i++) {
    var appt = existingApptCounts[i];
    if (appt.appointment_slot_id == apptSlot.appointment_slot_id && compareDates(appt.appointment_date, date)) {
      if (appt.count < apptSlot.num_allowed) {
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

module.exports = getAvailableAppts;
