angular
  .module('myApp')
  .controller('AdminAgencyEditController', ['UserService', '$http', '$location',
      function(UserService, $http, $location) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.agency = UserService.agency;
  vm.viewAgency = UserService.viewAgency;
  vm.editAgency = editAgency;
  vm.deleteAgency = deleteAgency;

  //Saves edits made to Agency record in the Agency-Edit viewAgency
  function editAgency(agency) {
    console.log('Save changes clicked: ', agency);
    $http.put('/agencies/', agency).then(function() {
      console.log('saves edits', agency);
      $location.path('/admin-agency-overview');
      alert('Your edits to ' + agency.name + ' have been saved.');
    });
  }

  function deleteAgency(agency) {
    console.log('Delete clicked: ', agency);
    // confirm('Are you sure you want to delete ' + agency.name + '?');
    if(confirm('Are you sure you want to delete ' + agency.name + '?')) {
      $http.delete('/agencies/' + agency.id).then(function() {
        console.log('Deleted Agency: ', agency.id);
        $location.path('/admin-agency-overview');
        alert(agency.name + ' has been deleted.');
        });
    } else {
      $location.path('/admin-agency-edit');
    }
  }

}]);
