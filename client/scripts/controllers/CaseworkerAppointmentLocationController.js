angular
  .module('myApp')
  .controller('CaseworkerAppointmentLocationController', ['CONSTANTS', 'UserService', function(CONSTANTS, UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference

  vm.CONSTANTS = CONSTANTS;
  vm.selectPickUpLocation = selectPickUpLocation;

  function selectPickUpLocation(location) {
    console.log(location);
    UserService.newAppointment.loc = location;
  }

}]);
