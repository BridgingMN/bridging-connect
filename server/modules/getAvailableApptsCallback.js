var moment = require('moment');
var pool = require('../modules/database.js');

function getAvailableAppts(appointment_type, delivery_method, location_id, min_date, max_date, res) {
  getApptSlots(appointment_type, delivery_method, location_id, min_date, max_date, res);
}

function getApptSlots(appointment_type, delivery_method, location_id, min_date, max_date, res) {
  pool.connect(function(connectionError, db, done) {
    if (connectionError) {
      console.log(connectionError, 'ERROR CONNECTING TO DATABASE');
      return connectionError;
    } else {
      db.query('SELECT "appointment_slots"."id" AS "appointment_slot_id", "appointment_slots"."num_allowed",' +
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
      [appointment_type, delivery_method, location_id],
      function(queryError, result){
        done();
        if (queryError) {
          console.log(queryError, 'ERROR MAKING QUERY');
        } else {
          var apptSlots = result.rows;
          var apptSlotIds = apptSlots.map(function(apptSlot) {
            return apptSlot.id;
          });
          console.log('apptSlots', apptSlots);
          console.log('apptSlotIds', apptSlotIds);
          return countExistingAppts(apptSlotIds, apptSlots, min_date, max_date, res);
        }
      });
    }
  });
}

// apptSlots is an array of appointment_slot_ids
// min_date & max_date are dates that act as inclusive bounds of the date range to be searched
function countExistingAppts(apptSlotIds, apptSlots, min_date, max_date, res) {
  return pool.connect(function(connectionError, db, done) {
    if (connectionError) {
      console.log(connectionError, 'ERROR CONNECTING TO DATABASE');
      return connectionError;
    } else {
      db.query('SELECT "appointments"."appointment_date", COUNT(*)' +
        'FROM "appointments"' +
        'JOIN "appointment_slots" ON "appointments"."appointment_slot_id" = "appointment_slots"."id"' +
        'JOIN "days" ON "appointment_slots"."day_id" = "days"."id"' +
        'WHERE "appointments"."appointment_slot_id" = ANY($1::int[])' +
        'AND "appointments"."appointment_date" >= $2' +
        'AND "appointments"."appointment_date" <= $3' +
        'GROUP BY "appointments"."appointment_date"',
      [apptSlotIds, min_date, max_date],
      function(queryError, result){
          done();
          if (queryError) {
            console.log(queryError, 'ERROR MAKING QUERY');
          } else {
            var existingApptCounts = result.rows;
            console.log(existingApptCounts);
            return getOverrides(min_date, max_date, apptSlotIds, apptSlots, existingApptCounts, res);
          }
        });
      }
    });
}

function getOverrides(min_date, max_date, apptSlotIds, apptSlots, existingApptCounts, res) {
  return pool.connect(function(connectionError, db, done) {
    if (connectionError) {
      console.log(connectionError, 'ERROR CONNECTING TO DATABASE');
      return connectionError;
    } else {
      db.query('SELECT * FROM "overrides"' +
      'WHERE "override_date" >= $1' +
      'AND "override_date" <= $2',
      [min_date, max_date],
      function(queryError, result){
          done();
          if (queryError) {
            console.log(queryError, 'ERROR MAKING QUERY');
          } else {
            var overrides = result.rows;
            console.log('overrides',overrides);
            return fillOutDateRange(min_date, max_date, apptSlots, existingApptCounts, overrides, res);
          }
        });
      }
  });
}

function fillOutDateRange(min_date, max_date, apptSlots, existingApptCounts, overrides, res) {
  var apptsAvailable = [];
  var date = min_date;
  while (date <= max_date) {
    var slotsForDate = [];
    var overridesForDate = checkForOverrides(date, overrides);
    if(overridesForDate) {
      slotsForDate = overridesForDate;
    } else {
      slotsForDate = findRelevant(apptSlots, date);
      console.log('slotsForDate', slotsForDate);
    }
    for (var i = 0; i < slotsForDate.length; i++) {
      var apptSlot = slotsForDate[i];
      var isAvailable = checkAvailability(apptSlot, date, existingApptCounts, res);
      if (isAvailable){
        apptSlot.date = formatDate(date);
        apptSlot.start_time = formatTime(apptSlot.start_time);
        apptSlot.end_time = formatTime(apptSlot.end_time);
        apptsAvailable.push(apptSlot);
      }
    }
    date = moment(date).add(1, 'days').format('YYYY-MM-DD');
  }
  console.log(apptsAvailable);
  res.send(apptsAvailable);
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
  for (var i = 0; i < existingApptCounts.length; i++) {
    var appt = existingApptCounts[i];
    if (appt.appointment_date == date && appt.appointment_slot_id == apptSlot.id) {
      console.log('date match:', appt.appointment_date, date);
      console.log('slot match:', appt.appointment_slot_id, apptSlot.id);
      if (appt.count < apptSlot.num_allowed) {
        return true;
      } else {
        return false;
      }
    }
  }
  return true;
}

function checkForOverrides(date, overrides) {
  if (overrides.length > 0) {
    return overrides.filter(function(row) {
      return new Date(row.override_date) == new Date(date);
    });
  } else {
    return false;
  }
}

function formatTime(time) {
  console.log('time', time);
  var formattedTime = moment(time, 'h:mm a');
  formattedTime = formattedTime.format('h:mm a');
  return formattedTime;
}

function formatDate(date) {
  var formattedDate = moment(date).format('MMMM D, YYYY');
  return formattedDate;
}

module.exports = getAvailableAppts;
