angular
  .module('myApp')
  .controller('CaseworkerAppointmentNewController', ['$location', 'CONSTANTS', 'UserService', function($location, CONSTANTS, UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.CONSTANTS = CONSTANTS;

  // methods
  vm.selectDeliveryType = selectDeliveryType;

  //This should call a method in the service that sets the appointment type property of the newAppointment object and then redirects the user to the next page.
  function selectDeliveryType(delivery_method) {
    console.log(delivery_method);
    UserService.newAppointment.setDeliveryType(delivery_method);
    console.log(UserService.newAppointment);
    setDeliveryRedirect(delivery_method);
  }

  //Redirects the caseworker to the appropriate next step in the appointment creation process
  function setDeliveryRedirect(delivery_method) {
    if (delivery_method === CONSTANTS.DELIVERYMETHOD_PICKUP) {
      $location.path('/caseworker-appointment-location');
    }
    else {
      $location.path('/caseworker-appointment-zipcode');
    }
  }

  //If there was an error inform the user their input was unsucessful
  function setDeliveryError(error) {
    console.log(error);
  }

}]);
