angular
  .module('myApp')
  .controller('AdminDefaultEditController', ['$http', '$location', 'UserService',
      function($http, $location, UserService) {
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
  vm.defaultEdit = {};
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
    function updateDefaultSlot(defaultEdit) {
      console.log('Updating Slot: ', defaultEdit);
      $http.put('/schedule/default', defaultEdit).then(function() {
        $location.path('/admin-appointments-default');
        alert('Changes to the default slot have been saved.');
      });
    }

}]);
