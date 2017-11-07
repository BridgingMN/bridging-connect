angular
.module('myApp')
.controller('AdminAdministratorNewController', ['$http', '$location', '$mdDialog', 'UserService',
    function($http, $location, $mdDialog, UserService) {
// DATA-BINDING VARIABLES
var vm = this; // controller reference
vm.agencies = UserService.agencies;
vm.getAgencies = UserService.getAgencies;
vm.administrator = {
  user_type: 'admin',
  agency_id: '',
  first: '',
  last: '',
  email: ''
};

vm.createAdministrator = createAdministrator;

//Creates a new Agency
function createAdministrator() {
  if(vm.administrator.name === '' || vm.administrator.first === '' ||
      vm.administrator.last === '' || vm.administrator.email === '') {
        caseworkerAlertDialog('Incomplete Form', 'Please complete all required fields.');
      } else {
        $http.post('/caseworkers', vm.administrator).then(function(response) {
          console.log(response);
          $location.path('/admin-caseworker-overview');
          caseworkerAlertDialog('Administrator Added', 'The new administrator has been added.');
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

function 

}]);
