angular
  .module('myApp')
  .controller('AdminAgencyNewController', ['$http', '$location', '$mdDialog', 'UserService',
      function($http, $location, $mdDialog, UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference

  vm.agency = {
    name: '',
    bridging_agency_id: ''
  }; //properties created in Admin-agency-new form
  vm.createAgency = createAgency;

  //Creates a new Agency
  function createAgency() {
    console.log('submit clicked', vm.agency);
    if(vm.agency.name === '' || vm.agency.bridging_agency_id === '') {
          completeAllFieldsDialog();
        } else {
          $http.post('/agencies', vm.agency).then(function(response) {
            console.log(response);
            $location.path('/admin-agency-overview');
            agencyCreatedDialog();
          });
        }
  }

  function agencyCreatedDialog() {
    $mdDialog.show(
     $mdDialog.alert()
       .clickOutsideToClose(true)
       .title('Agency Created')
       .textContent('The new agency has been added.')
       .ariaLabel('Agency Created Alert')
       .ok('Okay')
   );
  }

  function completeAllFieldsDialog() {
    $mdDialog.show(
     $mdDialog.alert()
       .clickOutsideToClose(true)
       .title('Incomplete Form')
       .textContent('Please complete all required fields.')
       .ariaLabel('Incomplete Form Alert')
       .ok('Okay')
   );
  }
}]);
