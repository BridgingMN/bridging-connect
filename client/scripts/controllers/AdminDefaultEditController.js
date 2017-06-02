angular
  .module('myApp')
  .controller('AdminDefaultEditController', ['$http', '$location', '$mdDialog', 'UserService',
      function($http, $location, $mdDialog, UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.locations = UserService.locations;
  vm.getLocations = UserService.getLocations;
  vm.days = UserService.days;
  vm.getDays = UserService.getDays;
  vm.types = UserService.types;
  vm.getTypes = UserService.getTypes;
  vm.methods = UserService.methods;
  vm.getMethods = UserService.getMethods;
  vm.defaultSlot = UserService.defaultSlot;
  vm.viewDefaultSlot = UserService.viewDefaultSlot;
  vm.updateDefaultSlot = updateDefaultSlot;
  vm.init = init;

  //Initializes all get routes to populate the form for creating a
  //default appointment slot
    function init() {
      vm.getLocations();
      vm.getDays();
      vm.getTypes();
      vm.getMethods();
    }

    //Updates the Default Appointment Slot
    function updateDefaultSlot(slot) {
      console.log('Updating Slot: ', slot);
      $http.put('/schedule/default', slot).then(function() {
        $location.path('/admin-appointments-default');
        appointmentAlertDialog('Appointment Slot Updated', 'Changes to the default slot have been saved.');
      });
    }

    function appointmentAlertDialog(title, text) {
      $mdDialog.show(
       $mdDialog.alert()
         .clickOutsideToClose(true)
         .title(title)
         .textContent(text)
         .ok('Okay')
     );
    }

}]);
