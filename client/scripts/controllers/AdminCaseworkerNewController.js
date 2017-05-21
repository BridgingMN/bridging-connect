angular
  .module('myApp')
  .controller('AdminCaseworkerNewController', ['UserService', '$http', '$location',
      function(UserService, $http, $location) {
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
          alert('Please complete all required fields.');
        } else {
          $http.post('/caseworkers', vm.caseworker).then(function(response) {
            console.log(response);
            $location.path('/admin-caseworker-overview');
            alert('The new caseworker has been added.');
          });
        }
  }

}]);
