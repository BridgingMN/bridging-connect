var moment = require('moment');

function formatTime(time) {
  var formattedTime = moment(time, 'h:mm a');
  formattedTime = formattedTime.format('h:mm a');
  return formattedTime;
}

function formatDate(date) {
  var formattedDate = moment(date).format('MMMM D, YYYY');
  return formattedDate;
}

function formatDateForPostgres(date) {
  var formattedDate = moment(date).format('YYYY-MM-DD');
  return formattedDate;
}

function formatTimeForPostgres(time) {
  return moment(time).format('HH:mm');
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  formatDateForPostgres: formatDateForPostgres,
  formatTimeForPostgres: formatTimeForPostgres
};
