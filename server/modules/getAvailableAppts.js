var moment = require('moment');
var pool = require('../modules/database.js');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

function getAvailableAppts(appointment_type, delivery_method, location_id, min_date, max_date) {
  var apptSlotsArray = [];
  var apptSlotIdsArray = [];
  var apptCountsArray = [];
  var overridesArray = [];

  getApptSlots(appointment_type, delivery_method, location_id)
  .then(function(apptSlots) {
    apptSlotsArray = apptSlots;
    apptSlotIdsArray = apptSlotsArray.filter(function(apptSlot) {
      return apptSlot.id;
    });
    return countExistingAppts(apptSlotIdsArray, min_date, max_date);
  })
  .then(function(existingApptCounts) {
    apptCountsArray = existingApptCounts;
    return getOverrides(min_date, max_date);
  })
  .then(function(overrides) {
    overridesArray = overrides;
    return fillOutDateRange(min_date, max_date, apptSlotsArray, apptCountsArray, overridesArray);
  })
  .then(function(apptsAvailable) {
    return apptsAvailable;
  })
  .catch(function(error) {
    console.log(error);
  });
}

function getApptSlots(appointment_type, delivery_method, location_id) {
  console.log('in get appt slots');
  return pool.connect().then(function(db) {
    db.query('SELECT "appointment_slots"."id", "appointment_slots"."num_allowed",' +
    '"appointment_slots"."start_time", "appointment_slots"."end_time",' +
    '"locations"."location", "locations"."street", "locations"."city",' +
    '"locations"."state", "appointment_types"."appointment_type",' +
    '"delivery_methods"."delivery_method", "days"."name" FROM "appointment_slots"' +
    'JOIN "locations" ON "appointment_slots"."location_id" = "locations"."id"' +
    'JOIN "delivery_methods" ON "appointment_slots"."delivery_method_id" = "delivery_methods"."id"' +
    'JOIN "appointment_types" ON "appointment_slots"."appointment_type_id" = "appointment_types"."id"' +
    'JOIN "days" ON "appointment_slots"."day_id" = "days"."id"' +
    'WHERE "appointment_types"."appointment_type" = $1' +
    'AND "delivery_methods"."delivery_method" = $2' +
    'AND "locations"."id" = $3',
    [appointment_type, delivery_method, location_id])
    .then(function(result) {
      db.release();
      var apptSlots = result.rows;
      console.log('ApptSlots:', apptSlots);
      return apptSlots;
    }).catch(function(queryError) {
      db.release();
      console.log(queryError, 'ERROR MAKING QUERY');
    });
  });
}

// apptSlots is an array of appointment_slot_ids
// min_date & max_date are dates that act as inclusive bounds of the date range to be searched
function countExistingAppts(apptSlotIds, min_date, max_date) {
  return pool.connect().then(function(connectionError, db) {
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
      [apptSlotIds, min_date, max_date])
      .then(function(result) {
        return result.rows;
      }).catch(function(queryError) {
        console.log(queryError, 'ERROR MAKING QUERY');
        return queryError;
      });
    }
  });
}

function getOverrides(min_date, max_date) {
  return pool.connect().then(function(connectionError, db) {
    if (connectionError) {
      console.log(connectionError, 'ERROR CONNECTING TO DATABASE');
      return connectionError;
    } else {
      db.query('SELECT * FROM "overrides"' +
      'WHERE "override_date" >= $1' +
      'AND "override_date" <= $2',
      [min_date, max_date])
      .then(function(result) {
        return result.rows;
      }).catch(function(queryError) {
        console.log(queryError, 'ERROR MAKING QUERY');
        return queryError;
      });
    }
  });
}

function fillOutDateRange(min_date, max_date, apptSlots, existingApptCounts, overrides) {
  var apptsAvailable = [];
  var date = min_date;
  while (date <= max_date) {
    var slotsForDate = [];
    var overridesForDate = checkForOverrides(date, overrides);
    if(overridesForDate) {
      slotsForDate = overridesForDate;
    } else {
      slotsForDate = findRelevant(apptSlots, date);
    }
    for (var i = 0; i < slotsForDate.length; i++) {
      var apptSlot = slotsForDate[i];
      var isAvailable = checkAvailability(apptSlot, date, existingApptCounts);
      if (isAvailable){
        apptsAvailable.push(apptSlot);
      }
    }
    date.add(1, 'days');
  }
  return apptsAvailable;
}

function findRelevant(apptSlots, date) {
  return apptSlots.filter(function(apptSlot) {
    return apptSlot.name === date.day(String);
  });
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

module.exports = getAvailableAppts;
