var postAppointment = require('../routes/appointments.js').postAppointment;
var postClient = require('../routes/clients.js').postClient;
var formatters = require('../modules/formatters.js');
var formatDateForPostgres = formatters.formatDateForPostgres;
var moment = require('moment');
var pool = require('../modules/database.js');
var getAvailableAppts = require('../modules/getAvailableAppts.js');
var Promise = require('bluebird');
var stockData = require('../data/dummyData.js');

// script to add a certain number of entries to appointments table
function insertDummyAppointments(numEntries) {
  getApptData()
  .then(function(pulledData) {
    for (var i = 0; i < numEntries; i++) {
      createAppointment(pulledData, stockData);
    }
  });
}

// gets data from DB that will be needed to create dummy appointments
function getApptData() {
  var raceEthnicities;
  var userIds;
  var appointmentTypes;
  var locationIds;
  var deliveryMethods;

  // can refactor this as promise.all
  return getRaceEthnicities()
  .then(function(result) {
    raceEthnicities = result;
    return getCaseworkerIds();
  })
  .then(function(result) {
    userIds = result;
    return getAppointmentTypes();
  })
  .then(function(result) {
    appointmentTypes = result;
    return getLocationIds();
  })
  .then(function(result) {
    locationIds = result;
    return getDeliveryMethods();
  })
  .then(function(result) {
    deliveryMethods = result;
    var pulledData = {
      raceEthnicities: raceEthnicities,
      userIds: userIds,
      appointmentTypes: appointmentTypes,
      locationIds: locationIds,
      deliveryMethods: deliveryMethods
    };
    return pulledData;
  });
}

// gets data from DB that will be needed to create dummy caseworkers
function getCaseworkerData() {
  var agencyIds;

  return getAgencyIds()
  .then(function(result) {
    return {
      agencyIds: result
    };
  });
}

function insertDummyCaseworkers(numEntries) {
  // get agency ids

  getCaseworkerData()
  .then(function(pulledData) {
    for (var i = 0; i < numEntries; i++) {
      createCaseworker(pulledData, stockData);
    }
  })
  .catch(function(error) {
    console.log(error);
  });
}

function createCaseworker(pulledData, stockData) {
  var agencyId = pickRandomFrom(pulledData.agencyIds).id;

  var firstName = pickRandomFrom(stockData.firstNames);
  var lastName = pickRandomFrom(stockData.lastNames);
  var email = generateEmail(firstName, lastName);

  postCaseworker(agencyId, firstName, lastName, email, false, 'caseworker');
}

function generateEmail(firstName, lastName) {
  var username = firstName.charAt(0).toLowerCase() + lastName.toLowerCase();
  var domain = pickRandomFrom(stockData.domains);
  var email = username + '@' + domain;
  return email;
}

function postCaseworker(agency_id, first, last, email, access_disabled, user_type) {
  return pool.connect().then(function(client) {
    return client.query('INSERT INTO "users" ("agency_id", "first", "last", "email", "access_disabled", "user_type_id") ' +
                    'VALUES ($1, $2, $3, $4, $5, ' +
                    '(SELECT "id" FROM "user_types" WHERE "user_type" = $6)) ' +
                    'RETURNING "id"',
                    [agency_id, first, last, email, access_disabled, user_type])
    .then(function(result) {
      client.release();
      return result.rows[0];
    })
    .catch(function(error) {
      client.release();
      console.error('query error', error.message, error.stack);
      return error;
    });
  });
}

function getAgencyIds() {
  var queryString = 'SELECT "id" FROM "agencies"';
  return getArrayFromQuery(queryString);
}

function generateRandomDate(startDaysFromToday, endDaysFromToday) {
  var start = moment().add(startDaysFromToday, 'days');
  var end = moment().add(endDaysFromToday, 'days');
  var date = new Date(+start + Math.random() * (end - start));
  date = formatDateForPostgres(date);
  return date;
}

// adds client to DB
// takes an array of stock first names, array of stock last names, array of stock street
// names, array of objects with city property & zip property
// returns id of created client
function createClient(pulledData, stockData) {
  var firstName = pickRandomFrom(stockData.firstNames);
  var lastName = pickRandomFrom(stockData.lastNames);
  var houseNumber = pickRandomFrom(stockData.houseNumbers);
  var street = pickRandomFrom(stockData.streets);
  var address = houseNumber + ' ' + street;
  var cityZip = pickRandomFrom(stockData.cityZips);
  var city = cityZip.city;
  var zip = cityZip.zip;
  var state = 'MN';
  var dob = pickRandomFrom(stockData.dobs);

  var raceEthnicity = pickRandomFrom(pulledData.raceEthnicities).race_ethnicity;
  return postClient(firstName, lastName, dob, raceEthnicity, address, city, state, zip)
  .then(function(result){
    return result;
  })
  .catch(function(error){
    console.log(error);
  });
}

function getRaceEthnicities() {
  var queryString = 'SELECT "race_ethnicity" FROM "race_ethnicity"';
  return getArrayFromQuery(queryString);
}

function createAppointment(pulledData, stockData) {
  var clientId;

  var userId = pickRandomFrom(pulledData.userIds).id;
  var appointmentType = pickRandomFrom(pulledData.appointmentTypes).appointment_type;
  var locationId = pickRandomFrom(pulledData.locationIds).id;
  var deliveryMethod = pickRandomFrom(pulledData.deliveryMethods).delivery_method;

  var createdDate = new Date();
  createdDate = formatDateForPostgres(createdDate);

  var status = pickStatus();

  console.log('userId:', userId, 'appointmentType:', appointmentType, 'locationId:', locationId,
  'deliveryMethod:', deliveryMethod, 'createdDate:', createdDate, 'status:', status);

  return createClient(pulledData, stockData)
  .then(function(result) {
    clientId = result.id;
    return pickRandomApptSlotId(appointmentType, deliveryMethod, locationId);
  })
  .then(function(appointment) {
    return postAppointment(appointment.date, userId, clientId, appointment.slotId, createdDate, status);
  })
  .catch(function(error) {
    console.log(error);
  });
}


// gets array of ids of all users whose user type is caseworker from DB
function getCaseworkerIds() {
  return pool.connect().then(function(client) {
    return client.query('SELECT "id" FROM "users" WHERE "user_type_id" = $1',
    [2])
    .then(function(result) {
      client.release();
      return result.rows;
    })
    .catch(function(error) {
      client.release();
      console.error('query error', error.message, error.stack);
      return error;
    });
  });
}

function getArrayFromQuery(queryString) {
  return pool.connect().then(function(client) {
    return client.query(queryString)
    .then(function(result) {
      client.release();
      // console.log(result.rows);
      return result.rows;
    })
    .catch(function(error) {
      client.release();
      console.error('query error', error.message, error.stack);
      return error;
    });
  });
}

// query DB & return an array of appointment type strings
function getAppointmentTypes() {
  var queryString = 'SELECT "appointment_type" FROM "appointment_types"';
  return getArrayFromQuery(queryString);
}

// query DB & return an array of delivery method strings
function getDeliveryMethods() {
  var queryString = 'SELECT "delivery_method" FROM "delivery_methods"';
  return getArrayFromQuery(queryString);
}

// query DB & return an array of location ids
function getLocationIds() {
  var queryString = 'SELECT "id" FROM "locations"';
  return getArrayFromQuery(queryString);
}

function pickRandomFrom(array) {
  var random = array[Math.floor(Math.random() * array.length)];
  return random;
}

// use getAvailableAppts to find appointments that match specs, then randomly
// pick the appointment_slot_id from one of them
function pickRandomApptSlotId(appointmentType, deliveryMethod, locationId) {
  var minDate = generateRandomDate(3, 90);
  var maxDate = moment(minDate).add(7, 'days');
  maxDate = formatDateForPostgres(maxDate);

  return getAvailableAppts(appointmentType, deliveryMethod, locationId, minDate, maxDate)
  .then(function(appointmentArray) {
    if (appointmentArray.length == 0) {
      console.log('repicking');
      if (appointmentType === 'new bed') {
        appointmentType = 'shopping';
      }
      return pickRandomApptSlotId(appointmentType, deliveryMethod, locationId);
    } else {
      var randomAppt = pickRandomFrom(appointmentArray);
      var appointment = {
        slotId: randomAppt.appointment_slot_id,
        date: formatDateForPostgres(randomAppt.date)
      };
      return appointment;
    }
  })
  .catch(function(error) {
    console.log(error);
  });
}

function pickStatus() {
  var status;
  var rand = Math.random();
  if (rand > 0.15) {
    status = 'confirmed';
  } else if (rand > 0.07) {
    status = 'pending';
  } else if (rand > 0.03) {
    status = 'canceled';
  } else if (rand > 0) {
    status = 'denied';
  }
  return status;
}

module.exports =  {
  inserts: {
    dummyAppointments: insertDummyAppointments,
    dummyCaseworkers: insertDummyCaseworkers
  }
};
