var Chance = require('chance');
var chance = new Chance();

function generateToken() {
  var token = chance.string({pool: 'abcdefghijklmnopqrstuvwxyz1234567890', length:20});
  return token;
}

function generateExpirationDate(daysUntilExpired) {
  var date = new Date();
  var expiration_date = new Date(date.setDate(date.getDate() + daysUntilExpired));
  return expiration_date;
}

module.exports.generateToken = generateToken;
module.exports.generateExpirationDate = generateExpirationDate;
