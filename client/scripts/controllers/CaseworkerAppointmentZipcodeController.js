angular
  .module('myApp')
  .controller('CaseworkerAppointmentZipcodeController', ['$location','UserService', function($location, UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference

  //model for the zipcode input
  vm.zipCode = 55405;

  vm.submitZipCode = submitZipCode;

  function submitZipCode(zip_code) {
    console.log(zip_code);
    console.log(UserService.newAppointment.submitZipCode);
    UserService.newAppointment.submitZipCode(zip_code)
      .then(zipCodeSuccess, zipCodeError);
  }

  function zipCodeSuccess(response) {
    console.log(response);
    var locationObject = response[0];
    UserService.newAppointment.location_name = locationObject.location;
    UserService.newAppointment.location_id =  locationObject.id;
    console.log('quack', UserService.newAppointment);
    $location.path('/caseworker-appointment-schedule');
  }

  function zipCodeError(error) {
    console.log(error);
  }

}]);
