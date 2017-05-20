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
    UserService.newAppointment.loc = response.data[0];
    console.log('quack', UserService.newAppointment);
    $location.path('/caseworker-appointment-schedule');
  }

  function zipCodeError(error) {
    console.log(error);
  }

}]);
