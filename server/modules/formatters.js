var moment = require('moment');

function formatTime(time) {
  var formattedTime = moment(time, 'h:mm a');
  formattedTime = formattedTime.format('h:mm a');
  return formattedTime;
}

function formatDate(date) {
  var formattedDate = moment(date).format();
  return formattedDate;
}

function formatDateForPostgres(date) {
  var formattedDate = moment(date).format('YYYY-MM-DD');
  return formattedDate;
}

function formatAppts(userAppts) {
  var formattedAppts = userAppts.map(function(userAppt) {
    var apptObj = {id: userAppt.id};
    apptObj.client = {
      client_id: userAppt.client_id,
      first: userAppt.first,
      last: userAppt.last,
      street: userAppt.client_street,
      city: userAppt.client_city,
      state: userAppt.client_state
    };
    apptObj.info = {
      appointment_number: userAppt.appointment_number,
      start_time: formatTime(userAppt.start_time),
      end_time: formatTime(userAppt.end_time),
      appointment_type: userAppt.appointment_type,
      location_id: userAppt.location_id,
      location_name: userAppt.location_name,
      street: userAppt.location_street,
      city: userAppt.location_city,
      state: userAppt.location_state,
      date: formatDate(userAppt.appointment_date),
      status: userAppt.status,
      delivery_method: userAppt.delivery_method
    };
    if (userAppt.delivery_date) {
      apptObj.info.delivery_date = formatDate(userAppt.delivery_date);
    }
    return apptObj;
  });
  return formattedAppts;
}

function formatClient(rows) {
  console.log('input in formatClient', rows);
  var clientObj = rows[0];
  clientObj.dob = formatDate(clientObj.dob);
  clientObj.client_id = clientObj.id;
  delete clientObj.id;
  console.log('output of formatClient', clientObj);
  return clientObj;
}

function formatTimeForPostgres(time) {
  return moment(time).format('HH:mm');
}

function formatTimeForClient(time) {
  return moment(time, 'HH:mm:ss').format('h:mm A');
}

function formatSingleAppointment(apptInfoObj) {
  return {
    apptInfo: {
      confirmation_id: apptInfoObj.confirmation_id,
      created_date: apptInfoObj.created_date,
      appointment_date: apptInfoObj.appointment_date,
      delivery_date: apptInfoObj.delivery_date,
      status: apptInfoObj.status,
      appointment_slot_id: apptInfoObj.appointment_slot_id,
      appointment_type: apptInfoObj.appointment_type,
      day: apptInfoObj.day,
      delivery_method: apptInfoObj.delivery_method,
      location_name: apptInfoObj.location_name,
      start_time: formatTimeForClient(apptInfoObj.start_time),
      end_time: formatTimeForClient(apptInfoObj.end_time)
    },
    userInfo: {
      user_id: apptInfoObj.user_id,
      email: apptInfoObj.user_email,
      first: apptInfoObj.user_first,
      last: apptInfoObj.user_last,
      day_phone: apptInfoObj.user_day_phone,
      ext: apptInfoObj.user_day_phone_ext,
    },
    agencyInfo: {
      agency_id: apptInfoObj.agency_id,
      name: apptInfoObj.agency_name,
      bridging_agency_id: apptInfoObj.bridging_agency_id,
      primary_first: apptInfoObj.primary_first,
      primary_last: apptInfoObj.primary_last,
      primary_job_title: apptInfoObj.primary_job_title,
      primary_business_phone: apptInfoObj.primary_business_phone,
      primary_business_phone_ext: apptInfoObj.primary_business_phone_ext,
      primary_email: apptInfoObj.primary_email
    },
    clientInfo: {
      client_id: apptInfoObj.client_id,
      first: apptInfoObj.client_first,
      last: apptInfoObj.client_last,
      dob: apptInfoObj.client_dob,
      street: apptInfoObj.street,
      city: apptInfoObj.city,
      state: apptInfoObj.state,
      zip_code: apptInfoObj.zip_code,
      race_ethnicity: apptInfoObj.race_ethnicity
    }
  };
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  formatDateForPostgres: formatDateForPostgres,
  formatTimeForPostgres: formatTimeForPostgres,
  formatAppts: formatAppts,
  formatSingleAppointment: formatSingleAppointment,
  formatClient: formatClient,
  formatTimeForClient: formatTimeForClient
};
