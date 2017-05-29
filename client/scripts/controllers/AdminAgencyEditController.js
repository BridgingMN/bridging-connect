angular
  .module('myApp')
  .controller('AdminAgencyEditController', ['$http', '$location', '$mdDialog',
      'UserService',
      function($http, $location, $mdDialog, UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference

  vm.agency = UserService.agency;
  vm.viewAgency = UserService.viewAgency;
  vm.editAgency = editAgency;
  vm.deleteAgency = deleteAgency;

  //Saves edits made to Agency record in the admin-agency-edit view
  function editAgency(agency) {
    console.log('Save changes clicked: ', agency);
    $http.put('/agencies/', agency).then(function() {
      console.log('saves edits', agency);
      agencyUpdatedDialog(agency.name);
      // $mdDialog.show(
      //   $mdDialog.alert()
      //   .parent
      // );
      $location.path('/admin-agency-overview');
    });
  }

//Deletes selected Agency from the admin-agency-edit view
  function deleteAgency(agency) {
    console.log('Delete clicked: ', agency);
    if(confirm('Are you sure you want to delete ' + agency.name + '?')) {
      $http.delete('/agencies/' + agency.id).then(function() {
        console.log('Deleted Agency: ', agency.id);
        $location.path('/admin-agency-overview');
        agencyDeletedDialog(agency.name);
        });
    } else {
      $location.path('/admin-agency-edit');
    }
  }

  function agencyUpdatedDialog(agency) {
    $mdDialog.show(
     $mdDialog.alert()
       .clickOutsideToClose(true)
       .title('Agency Updated')
       .textContent('Your edits to ' + agency + ' have been saved.')
       .ariaLabel('Agency Updated Alert')
       .ok('Okay')
   );
  }

  function agencyDeletedDialog(agency) {
    $mdDialog.show(
     $mdDialog.alert()
       .clickOutsideToClose(true)
       .title('Agency Removed')
       .textContent(agency + ' has been deleted.')
       .ariaLabel('Agency Deleted Alert')
       .ok('Okay')
   );
  }

}]);
