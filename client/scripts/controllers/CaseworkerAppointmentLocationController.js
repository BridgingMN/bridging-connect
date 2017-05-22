angular
  .module('myApp')
  .controller('CaseworkerAppointmentLocationController', ['CONSTANTS', 'UserService', function(CONSTANTS, UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference

  vm.CONSTANTS = CONSTANTS;
  vm.selectPickUpLocation = selectPickUpLocation;

  function selectPickUpLocation(location) {
    console.log('Selected location', location);
    UserService.newAppointment.location_id = location.location_id;
    UserService.newAppointment.location_name = location.location_name;
  }

}]);
