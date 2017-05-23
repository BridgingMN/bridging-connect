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

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  formatDateForPostgres: formatDateForPostgres,
  formatTimeForPostgres: formatTimeForPostgres,
  formatAppts: formatAppts,
  formatClient: formatClient,
  formatTimeForClient: formatTimeForClient
};
