angular
  .module('myApp')
  .controller('CaseworkerAppointmentZipcodeController', ['UserService', function(UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference

  //model for the zipcode input
  vm.zipcode = '';

  vm.submitZipcode = submitZipcode;

  function submitZipcode(zipcode) {
    console.log(zipcode);
    //This function takes in the client's zip code. Based on this input it should select the correct Bridging location for that zip code and redirect the caseworker to the scheduling page showing available appointments for that location
  }

}]);
