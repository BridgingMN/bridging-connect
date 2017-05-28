angular
  .module('myApp')
  .factory('ScheduleService', ['$http', 'CONSTANTS', function ($http, CONSTANTS) {

    return {
      getOverridesForDate: getOverridesForDate,
      postOverrides: postOverrides,
      putOverrides: putOverrides
    };

    function getOverridesForDate(date, location) {
      var params = {
        override_date: date,
        location_name: location
      };
      return $http.get('/overrides', {params: params})
        .then(returnResponse, returnError);
    }

    function postOverrides(date, overrides) {
      var params = {
        override_date: date,
        overridesArray: overrides
      };
      return $http.post('/overrides', params)
        .then(returnResponse, returnError);
    }

    function putOverrides(overrides) {
      var params = {
        overridesArray: overrides
      };
      return $http.put('/overrides', params)
        .then(returnResponse, returnError);
    }

    function returnResponse(response) {
      console.log('Success', response );
      return response.data;
    }

    function returnError(error) {
      console.log('Error', error);
      return error;
    }
}]);
