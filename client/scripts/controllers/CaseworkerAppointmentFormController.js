angular
  .module('myApp')
  .controller('CaseworkerAppointmentFormController', ['UserService', function(UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.clientDateOfBirth = new Date();
  vm.clientEthnicity = '';
  vm.ethnicities = ['African', 'American Indian or Alaska Native', 'Asian or Pacific Islander', 'Black or African American', 'Hispanic', 'Mixed Racial Background', 'White', 'Other'].map(function (ethnicity) { return { description: ethnicity }; });

}]);
