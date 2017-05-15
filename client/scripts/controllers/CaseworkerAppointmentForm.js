myApp.controller('CaseworkerAppointmentForm', ['UserService', function(UserService) {
  // DATA-BINDING VARIABLES
  this.clientDateOfBirth = new Date();
  this.clientEthnicity = '';
  this.ethnicities = ['African', 'American Indian or Alaska Native', 'Asian or Pacific Islander', 'Black or African American', 'Hispanic', 'Mixed Racial Background', 'White', 'Other'].map(function (ethnicity) { return { description: ethnicity }; });

}]);
