console.log('dataExport.js loaded');
var express = require('express');
var router = express.Router();
var pool = require('../modules/database.js');
var json2csv = require('json2csv');


router.get('/dataExport', function(req, res) {
  pool.connect(function(connectionError, db, done) {
    if (connectionError) {
      console.log('error connecting to database on /export route');
      res.sendStatus(500);
    } else {
      db.query('SELECT * FROM "appointments";',
        function(queryError, result) {
          done();
          if (queryError) {
            console.log('error making query on /export route', queryError);
            res.sendStatus(500);
          } else {
            var appointmentsArray = result.rows;
            console.log('got the appointmentsArray, numAppts =', appointmentsArray.length);
            res.send(appointmentsArray);
          }
        });
    }
  });
});

// try {
//   // var result = json2csv({ data: myData, fields: fields });
//   // console.log(result);
// } catch (err) {
//   // Errors are thrown for bad options, or if the data is empty and no fields are provided.
//   // Be sure to provide fields if it is possible that your data array will be empty.
//   console.error(err);
// }

module.exports = router;