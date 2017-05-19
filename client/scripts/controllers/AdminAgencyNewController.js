angular
  .module('myApp')
  .controller('AdminAgencyNewController', ['UserService', '$http', '$location',
      function(UserService, $http, $location) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference

  vm.agency = {
    name: '',
    bridging_agency_id: '',
    primary_first: null,
    primary_last: null,
    primary_job_title: null,
    primary_department: null,
    primary_business_phone: null,
    primary_business_phone_ext: null,
    primary_mobile_phone: null,
    primary_email: null,
    access_disabled: false,
    notes: null,
    beds_allowed_option: ''
  };
  vm.createAgency = createAgency;

  //Creates a new Agency
  function createAgency() {
    console.log('submit clicked', vm.agency);
    $http.post('/agencies', vm.agency).then(function(response) {
      console.log(response);
      $location.path('/admin-agency-overview');
      alert('Your agency has been added.');
    });
  }

}]);
