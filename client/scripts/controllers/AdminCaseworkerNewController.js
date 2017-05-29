angular
  .module('myApp')
  .controller('AdminCaseworkerNewController', ['$http', '$location', '$mdDialog', 'UserService',
      function($http, $location, $mdDialog, UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.agencies = UserService.agencies;
  vm.getAgencies = UserService.getAgencies;
  vm.caseworker = {
    agency_id: '',
    first: '',
    last: '',
    email: ''
  }; //Other properties created in the new caseworker form

  vm.createCaseworker = createCaseworker;

  //Creates a new Agency
  function createCaseworker() {
    console.log('Create Caseworker clicked', vm.caseworker);
    if(vm.caseworker.name === '' || vm.caseworker.first === '' ||
        vm.caseworker.last === '' || vm.caseworker.email === '') {
          caseworkerAlertDialog('Incomplete Form', 'Please complete all required fields.');
        } else {
          $http.post('/caseworkers', vm.caseworker).then(function(response) {
            console.log(response);
            $location.path('/admin-caseworker-overview');
            caseworkerAlertDialog('Caseworker Added', 'The new caseworker has been added.');
          });
        }
  }

  function caseworkerAlertDialog(title, text) {
    $mdDialog.show(
     $mdDialog.alert()
       .clickOutsideToClose(true)
       .title(title)
       .textContent(text)
       .ok('Okay')
   );
  }

}]);
