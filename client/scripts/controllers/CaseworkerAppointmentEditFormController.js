angular
  .module('myApp')
  .controller('CaseworkerAppointmentEditFormController', ['$location', 'UserService', function($location, UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference

  //Model for the appointment info header
  vm.appointment = UserService.newAppointment;

  //Model for the clientReferralForm
  vm.clientReferralForm = {

  };

  //These are placeholders, these will be properties of the clientReferralForm object
  vm.clientDateOfBirth = new Date();
  vm.clientEthnicity = '';

  //Model for ethnicities drop down
  vm.ethnicities = ['African', 'American Indian or Alaska Native', 'Asian or Pacific Islander', 'Black or African American', 'Hispanic', 'Mixed Racial Background', 'White', 'Other'].map(function (ethnicity) { return { description: ethnicity }; });

  //Model for States on State drop down
  vm.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
            'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
            'WY').split(' ').map(function (state) { return { abbrev: state }; });

  //Methods
  vm.submitClientForm = submitClientForm;

  //This function should call method from the service that posts the clientReferralForm and the appointment to the database and then redirects the caseworker to the appointment dashboard
  function submitClientForm() {
    UserService.newAppointment.createNewAppointment(vm.clientReferralForm)
      .then(appointmentCreateSuccess, appointmentCreateError);
  }

  function appointmentCreateSuccess(response) {
    console.log(response)
    $location.path('/caseworker-appointments-all');
  }

  function appointmentCreateError(error) {
    console.error('Failed to create appointment', error);
  }

}]);
