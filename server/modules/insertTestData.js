var postAppointment = require('../routes/appointments.js').postAppointment;
var postClient = require('../routes/clients.js').postClient;
var formatters = require('../modules/formatters.js');
var formatDateForPostgres = formatters.formatDateForPostgres;
var moment = require('moment');
var pool = require('../modules/database.js');
var getAvailableAppts = require('../modules/getAvailableAppts.js');
var Promise = require('bluebird');
var stockData = require('../data/dummyData.js');
var request = require('request');

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

function setStreetAddress(stockData) {
  var houseNumber = pickRandomFrom(stockData.houseNumbers);
  var streetName = pickRandomFrom(stockData.streets);
  var streetAddress = houseNumber + ' ' + streetName;
  return streetAddress;
}

function Client(pulledData, stockData) {
  this.dob = pickRandomFrom(stockData.dobs);
  this.first = pickRandomFrom(stockData.firstNames);
  this.last = pickRandomFrom(stockData.lastNames);
  this.street = setStreetAddress(stockData);

  var cityZip = pickRandomFrom(stockData.cityZips);
  this.city = cityZip.city;
  this.state = 'MN';
  this.zip_code = cityZip.zip;
  this.county = getCountyForCity(this.city);

  if (Math.random < 0.1) {
    this.building_access_code = setBuildingAccessCode();
  }

  this.primary_phone = generatePhoneNumber();
  if (Math.random < 0.25) {
    this.alternate_phone = generatePhoneNumber();
  }
  this.email = generateEmail(this.first, this.last);
  this.used_bridging_services_previously = convertBoolToYesNo(setUsedBridgingPreviously());
  this.race_ethnicity = pickRandomFrom(pulledData.raceEthnicities).race_ethnicity;
  this.marital_status = setMaritalStatus();
  this.sex = setSex();
  this.age = setAge(this.dob);
  this.household_size = setHouseholdSize();
  this.num_children_17_and_under = setNumChildren17AndUnder(this.household_size);
  this.num_bedrooms = setNumBedrooms(this.household_size);
  this.home_visit_completed = setHomeVisitDate();
  this.completed_client_checklist = true;
  this.yearly_income = setYearlyIncome();
  this.was_client_homeless = convertBoolToYesNo(setWasHomeless());
  if (this.was_client_homeless === 'Yes') {
    this.how_long_homeless = setHowLongHomeless();
  }
  this.what_brought_client_to_bridging = setWhatBroughtClientToBridging();
  this.will_bring_interpreter = setBoolean(.25);
  this.client_understands_furniture_is_used = true;
  this.client_understands_furniture_must_be_moved_within_48hrs = true;
  this.will_bring_assistant_due_to_mental_health_or_physical_limits = convertBoolToYesNo(setBoolean(.10));
  this.who_paying_for_appointment = setWhoPayingForAppointment();
  if (this.who_paying_for_appointment ==='Other Paying Bridging') {
    this.if_other_who_paying_appointment = setIfOtherWhoPaying();
  }
  this.elevator_in_building = setBoolean(.15);
  this.used_beds_needed = convertBoolToYesNo(setBoolean(.20));
  this.additional_notes = 'This is dummy data for testing purposes';

  if (this.used_beds_needed === 'No') {
    if (Math.random() < 0.25) {
      this.new_beds_and_frames_needed = 'Yes';
      this.who_paying_for_new_beds_and_frames = setWhoPayingForNewBeds();
      this.new_twin_mattress_and_box_spring = Math.round(Math.random());
      this.new_full_mattress_and_box_spring = Math.round(Math.random());
      this.new_queen_mattress_and_box_spring = Math.round(Math.random());
      this.new_twin_full_bed_frame = Math.round(Math.random());
      this.new_queen_king_bed_frame = Math.round(Math.random());
    } else {
      this.new_beds_and_frames_needed = 'No';
    }
  }
}

// adds client to DB
// returns id of created client
function createClient(pulledData, stockData) {
  var client = new Client(pulledData, stockData);
  return postClient(client)
  .then(function(result) {
    return result;
  })
  .catch(function(error) {
    console.log(error);
  });
}

function getRaceEthnicities() {
  var queryString = 'SELECT "race_ethnicity" FROM "race_ethnicity"';
  return getArrayFromQuery(queryString);
}

function getCountyForCity(thisCity) {
  for (var i = 0; i < stockData.cityCounties.length; i++) {
    if (stockData.cityCounties[i].city === thisCity) {
      return stockData.cityCounties[i].county;
    }
  }
}

function setBoolean(chanceOfTrue) {
  var rand = Math.random();
  var bool;
  if (rand < chanceOfTrue) {
    bool = true;
  } else {
    bool = false;
  }
  return bool;
}

function convertBoolToYesNo(bool) {
  if (bool) {
    return 'Yes';
  } else {
    return 'No';
  }
}

// building_access_code VARCHAR(10),
function setBuildingAccessCode() {
  return (Math.floor(1000 + Math.random() * 9000)).toString();
}

// primary_phone VARCHAR(25) NOT NULL,
function generatePhoneNumber() {
  var phoneNumber = (Math.floor(100000000 + Math.random() * 900000000)).toString();
  return phoneNumber
}

// alternate_phone VARCHAR(25),
function setAlternatePhoneNumber() {
  var altPhone = null;
  var rand = Math.random();
  if (rand < .25) {
    altPhone = generatePhoneNumber();
  }
  return altPhone;
}

// used_bridging_services_previously BOOLEAN NOT NULL,
function setUsedBridgingPreviously() {
  var usedBridgingPreviously;
  var rand = Math.random();
  if (rand < .02) {
    usedBridgingPreviously = true;
  } else {
    usedBridgingPreviously = false;
  }
  return usedBridgingPreviously;
}

// marital_status VARCHAR(50) NOT NULL,
function setMaritalStatus() {
  var maritalStatus;
  var rand = Math.random();
  if (rand < 0.5) {
    maritalStatus = 'Married';
  } else {
    maritalStatus = 'Single, Separated, Widowed, or Divorced';
  }
  return maritalStatus;
}

// sex VARCHAR(10) NOT NULL,
function setSex() {
  var sex;
  if (Math.random() < 0.5) {
    sex = 'Male';
  } else {
    sex = 'Female';
  }
  return sex;
}

// age INTEGER NOT NULL,
function setAge(dob) {
  var birthdate = new Date(dob);
  var ageDifMs = Date.now() - birthdate.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

// household_size INTEGER NOT NULL,
function setHouseholdSize() {
  var householdSize = Math.floor(Math.random() * 8) + 1;
  return householdSize;
}
// num_children_17_and_under INTEGER NOT NULL,
function setNumChildren17AndUnder(householdSize) {
  var numAdults = Math.ceil(Math.random() * householdSize);
  return householdSize - numAdults;
}

// num_bedrooms INTEGER NOT NULL,
function setNumBedrooms(householdSize) {
  return Math.ceil(householdSize/2);
}

// home_visit_completed DATE,
function setHomeVisitDate() {
  var today = new Date();
  var oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 7);
  return formatDateForPostgres(oneWeekAgo);
}

// yearly_income VARCHAR(25) NOT NULL,
function setYearlyIncome() {
  var yearlyIncome;
  var rand = Math.random();
  if (rand < 0.25) {
    yearlyIncome = 'Under $5,000'
  } else if (rand < 0.5) {
    yearlyIncome = '$5,000 - $9,999';
  } else if (rand < 0.75) {
    yearlyIncome = '$10,000 = $14,999';
  } else {
    yearlyIncome = 'Over $20,000';
  }
  return yearlyIncome;
}

// was_client_homeless BOOLEAN NOT NULL,
function setWasHomeless() {
  var wasHomeless;
  var rand = Math.random();
  if (rand < .66) {
    wasHomeless = false;
  } else {
    wasHomeless = true;
  }
}

// how_long_homeless VARCHAR(25),
function setHowLongHomeless() {
  var howLongOptions = ['Less than 1 Month', '1-3 Months', '4-12 Months',
    'Over 12 Months', 'Was not homeless'];
  return pickRandomFrom(howLongOptions);
}

// what_brought_client_to_bridging VARCHAR(255) NOT NULL,
function setWhatBroughtClientToBridging() {
  var whatBroughtClientToBridgingOptions = ['Disability', 'Domestic Violence',
  'Foreclosure/Loss of Home', 'Immigration', 'Job Loss', 'Leaving Prison', 'Medical Bills',
  'Mental Health', 'Natural Disaster', 'Persistent Low Income', 'Substance Abuse',
  'Bed Bug Infestation'];
  return pickRandomFrom(whatBroughtClientToBridgingOptions);
}

// will_bring_interpreter BOOLEAN,
function setWillBringInterpreter() {
  var willBringInterpreter;
  var rand = Math.random();
  if (rand < .75) {
    willBringInterpreter = false;
  } else {
    willBringInterpreter = true;
  }
  return willBringInterpreter;
}

// who_paying_for_appointment VARCHAR(255),
function setWhoPayingForAppointment() {
  var whoPayingOptions = ['Referring Agency', 'Client or Other Paying Referring Agency',
      'Client Paying Bridging', 'Other Paying Bridging'];
  return pickRandomFrom(whoPayingOptions);
}

// if_other_who_paying_appointment VARCHAR(75),
function setIfOtherWhoPaying() {
  return pickRandomFrom(['The client\'s family', 'Referring agency will give money to client',
      'Still need to figure this out', 'Client may pay but maybe agency will']);
}

// who_paying_for_new_beds_and_frames VARCHAR(75),
function setWhoPayingForNewBeds() {
  var whoPayingOptions = ['Referring Agency', 'Client or Other Paying Referring Agency',
      'Client Paying Bridging'];
  var whoPaying = pickRandomFrom(whoPayingOptions);
  return whoPaying;
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
