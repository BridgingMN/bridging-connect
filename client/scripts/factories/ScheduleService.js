angular
  .module('myApp')
  .factory('ScheduleService', ['$http', 'CONSTANTS', function ($http, CONSTANTS) {

    return {
      getOverridesForDate: getOverridesForDate
    };

    function getOverridesForDate(date, location) {
      var params = {
        override_date: date,
        location_name: location
      };
      return $http.get('/overrides', {params: params})
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
