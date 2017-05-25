angular
  .module('myApp')
  .controller('AdminAppointmentsCustomizeController', ['UserService', function(UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.locations = UserService.locations;
  vm.getLocations = UserService.getLocations;
  vm.types = UserService.types;
  vm.getTypes = UserService.getTypes;
  vm.methods = UserService.methods;
  vm.getMethods = UserService.getMethods;
  vm.init = init;

  //Initializes all get routes to populate the form for creating a
  //customized appointment slot
    function init() {
      vm.getLocations();
      vm.getTypes();
      vm.getMethods();
    }


//for location selector
  // vm.locations = ['Bloomington', 'Roseville'];
  // vm.selectedLocation;
  // vm.getSelectedLocation = function() {
  //    if (vm.selectedLocation !== undefined) {
  //      return 'You have selected: ' + vm.selectedLocation;
  //    } else {
  //      return 'Please select an location.';
  //    }
  //  };
//for datepicker
  //  vm.myDate = new Date();
  //  vm.isOpen = false;

}]);
