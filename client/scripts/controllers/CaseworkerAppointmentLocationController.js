angular
  .module('myApp')
  .controller('CaseworkerAppointmentLocationController', ['UserService', function(UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference

  vm.selectPickUpLocation = selectPickUpLocation;

  function selectPickUpLocation(location) {
    console.log(location);
    //This function should call a function in the service that sets the location for the appointment in the newAppointment object and then redirects the caseworker to the next view.
  }

}]);
