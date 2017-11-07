var express = require('express');
var router = express.Router();
var insertTestData = require('../modules/insertTestData.js').inserts;

router.get('/appointments/:numEntries', function(req, res) {
  console.log('Adding dummy appointments to database');
  var numEntries = parseInt(req.params.numEntries);
  insertTestData.dummyAppointments(numEntries);
});

router.get('/caseworkers/:numEntries', function(req, res) {
  console.log('Adding dummy caseworkers to database');
  var numEntries = parseInt(req.params.numEntries);
  insertTestData.dummyCaseworkers(numEntries);
});

module.exports = router;
