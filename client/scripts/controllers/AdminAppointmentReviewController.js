angular
  .module('myApp')
  .controller('AdminAppointmentReviewController', ['$http', '$location', 'UserService',
      function($http, $location, UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.appointment = UserService.appointment;
  vm.viewDetails = UserService.viewDetails;
  vm.editClient = editClient;
  // vm.confirmApt = confirmApt;
  // vm.denyApt = denyApt;
  // vm.cancelApt = cancelApt;

//Model for ethnicities drop down
vm.ethnicities = ['African', 'American Indian or Alaska Native',
    'Asian or Pacific Islander', 'Black or African American', 'Hispanic',
    'Mixed Racial Background', 'White', 'Other'].map(function (ethnicity) {
        return { description: ethnicity }; });

//Model for States on State drop down
vm.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA ' +
    'MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT ' +
    'VA WA WV WI WY').split(' ').map(function (state) { return { abbrev: state }; });

  function editClient(client) {
    console.log('Updating client: ', client);
    $http.put('/clients', client).then(function() {
      $location.path('/admin-appointments-all');
      alert('Your edits to ' + client.first + ' ' + client.last + ' have been saved.');
    });
  }

}]);
