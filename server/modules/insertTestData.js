var postAppointment = require('../routes/appointments.js').postAppointment;
var postClient = require('../routes/appointments.js').postClient;
var formatters = require('../modules/formatters.js');
var formatDateForPostgres = formatters.formatDateForPostgres;
var moment = require('moment');
var pool = require('../modules/database.js');
var getAvailableAppts = require('../modules/getAvailableAppts.js');
var Promise = require('bluebird');
var dummyData = require('../data/dummyData.js');
var firstNames = dummyData.firstNames;
var lastNames = dummyData.lastNames;
var streets = dummyData.streets;
var houseNumbers = dummyData.houseNumbers;
var cityZips = dummyData.cityZips;

// script to add a certain number of entries to appointments table
function insertTestData(numEntries) {}

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
function createClient(firstNames, lastNames, houseNumbers, streets, cityZips, dobs) {
  var firstName = pickRandomFrom(firstNames);
  var lastName = pickRandomFrom(lastNames);
  var houseNumber = pickRandomFrom(houseNumbers);
  var street = pickRandomFrom(streets);
  var address = houseNumber + ' ' + street;
  var cityZip = pickRandomFrom(cityZips);
  var city = cityZip.city;
  var zip = cityZip.zip;
  var state = 'MN';
  var dob = pickRandomFrom(dobs);

  var raceEthnicity;
  return getRaceEthnicities()
  .then(function(raceEthnicities) {
    raceEthnicity = pickRandomFrom(raceEthnicities);
    return postClient(firstName, lastName, dob, raceEthnicity, address, city, state, zip);
  })
  .then(function(result){
    return result;
  });
}

function getRaceEthnicities() {
  return pool.connect().then(function(client) {
    return client.query('SELECT "race_ethnicity" FROM "race_ethnicity"')
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

function createAppointment(firstNames, lastNames, streets, cityZips) {
  var clientId;

  var userIds = getCaseworkerIds();
  var userId = pickRandomFrom(userIds);

  var appointmentTypes = getAppointmentTypes();
  var appointmentType = pickRandomFrom(appointmentTypes);

  var locationIds = getLocationIds();
  var locationId = pickRandomFrom(locationIds);

  var deliveryMethods = getDeliveryMethods();
  var deliveryMethod = pickRandomFrom(deliveryMethods);

  var createdDate = new Date();
  createdDate = formatDateForPostgres(createdDate);

  var status = pickStatus();

  return createClient(firstNames, lastNames, streets, cityZips)
  .then(function(id) {
    clientId = id;
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
function getCaseworkerIds() {}

// query DB & return an array of appointment type strings
function getAppointmentTypes() {}

// query DB & return an array of delivery method strings
function getDeliveryMethods() {}

// query DB & return an array of location ids
function getLocationIds() {}

function pickRandomFrom(array) {
  var random = array[Math.floor(Math.random() * array.length)];
  return random;
}

// use getAvailableAppts to find appointments that match specs, then randomly
// pick the appointment_slot_id from one of them
function pickRandomApptSlotId(appointmentType, deliveryMethod, locationId) {
  var randomDate = generateRandomDate();

  return new Promise(function() {
    getAvailableAppts(appointmentType, deliveryMethod, locationId, randomDate)
    .then(function(appointmentArray) {
      if (appointmentArray.length == 0) {
        return pickRandomApptSlotId(appointmentType, deliveryMethod, locationId);
      } else {
        var randomAppt = pickRandomFrom(appointmentArray);
        return {
          slotId: randomAppt.appointment_slot_id,
          date: formatDateForPostgres(randomAppt.date)
        };
      }
    })
    .catch(function(error) {
      console.log(error);
    });
  });
}

function pickStatus() {
  var status;
  var rand = Math.random();
  if (rand > 0.33) {
    status = 'confirmed';
  } else if (rand > 0.15) {
    status = 'pending';
  } else if (rand > 0.7) {
    status = 'canceled';
  } else {
    status = 'denied';
  }
  return status;
}

module.exports =  {
  insertTestData: insertTestData,
  generateRandomApptDate: generateRandomApptDate
};
