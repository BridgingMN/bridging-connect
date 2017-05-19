angular
  .module('myApp')
  .controller('AdminCaseworkerNewController', ['UserService', '$http', '$location',
      function(UserService, $http, $location) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.caseworker = {
    user_type: 'casworker',
    agency: '',
    bridging_agency_id: '',
    first: '',
    last: '',
    department: null,
    street: null,
    city: null,
    state: null,
    zip_code: null,
    day_phone: null,
    ext: null,
    email: '',
    notes: '',
    access_disabled: false
  };

  vm.createCaseworker = createCaseworker;

  //Creates a new Agency
  function createCaseworker() {
    console.log('submit clicked', vm.caseworker);
    $http.post('/caseworkers', vm.caseworker).then(function(response) {
      console.log(response);
      $location.path('/admin-caseworker-overview');
      alert('The new caseworker has been added.');
    });
  }

}]);
