angular
  .module('myApp')
  .controller('AdminAgencyNewController', ['UserService', '$http', '$location',
      function(UserService, $http, $location) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference

  vm.agency = {};
  vm.createAgency = createAgency;

  //Creates a new Agency
  function createAgency() {
    console.log('submit clicked', vm.agency);
    $http.post('/agencies', vm.agency).then(function(response) {
      console.log(response);
      $location.path('/admin-agency-overview');
      alert('The new agency has been added.');
    });
  }

}]);
