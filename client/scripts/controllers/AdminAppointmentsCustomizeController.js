angular
  .module('myApp')
  .controller('AdminAppointmentsCustomizeController', ['UserService', function(UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  // vm.hello = "Hello in Appointments-Customize!";


//for location selector
  vm.locations = ['Bloomington', 'Roseville'];
  vm.selectedLocation;
  vm.getSelectedLocation = function() {
     if (vm.selectedLocation !== undefined) {
       return 'You have selected: ' + vm.selectedLocation;
     } else {
       return 'Please select an location.';
     }
   };
//for datepicker
   vm.myDate = new Date();
   vm.isOpen = false;

}]);
