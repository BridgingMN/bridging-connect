angular
  .module('myApp')
  .controller('CaseworkerAppointmentZipcodeController', ['$location','UserService', function($location, UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference

  //model for the zipcode input
  vm.zipcode = '';

  vm.submitZipcode = submitZipCode;

  function submitZipCode(zip_code) {
    console.log(zip_code);
    UserService.newAppointment.submitZipCode(zip_code)
      .then(zipCodeSuccess, zipCodeError);
  }

  function zipCodeSuccess(location) {
    console.log(location);
    $location.path('/caseworker-appointment-schedule');
  }

  function zipCodeError(error) {
    console.log(error);
  }

}]);
