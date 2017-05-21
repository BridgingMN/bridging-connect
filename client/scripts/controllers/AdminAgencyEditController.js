angular
  .module('myApp')
  .controller('AdminAgencyEditController', ['UserService', '$http', '$location',
      function(UserService, $http, $location) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.agency = UserService.agency;
  vm.viewAgency = UserService.viewAgency;
  vm.editAgency = editAgency;

  //Saves edits made to Agency record in the Agency-Edit viewAgency
  function editAgency(agency) {
    console.log('Save changes clicked: ', agency);
    $http.put('/agencies/', agency).then(function() {
      console.log('saves edits', agency);
      alert('Your edits have been saved.');
      $location.path('/admin-agency-overview');
    });

  }

}]);
