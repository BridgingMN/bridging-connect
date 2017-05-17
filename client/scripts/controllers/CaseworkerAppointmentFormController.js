angular
  .module('myApp')
  .controller('CaseworkerAppointmentFormController', ['UserService', function(UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference

  //Model for the appointment info header
  vm.appointment = {

  };

  //Model for the clientReferralForm
  vm.clientReferralForm = {

  };

  //These are placeholders, these will be properties of the clientReferralForm object
  vm.clientDateOfBirth = new Date();
  vm.clientEthnicity = '';

  //Model for ethnicities drop down
  vm.ethnicities = ['African', 'American Indian or Alaska Native', 'Asian or Pacific Islander', 'Black or African American', 'Hispanic', 'Mixed Racial Background', 'White', 'Other'].map(function (ethnicity) { return { description: ethnicity }; });

  //Methods
  vm.submitClientForm = submitClientForm;

  function submitClientForm() {
    //This function should call method from the service that posts the clientReferralForm and the appointment ot the database and then redirects the caseworker to the appointment dashboard
  }

}]);
