angular
  .module('myApp')
  .controller('CaseworkerAppointmentNewController', ['UserService', function(UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference

  vm.selectDeliveryType = selectDeliveryType;

  function selectDeliveryType(deliveryType) {
    console.log(deliveryType);
    //This should call a method in the service that sets the appointment type property of the newAppointment object and then redirects the user to the next page.
  }

}]);
