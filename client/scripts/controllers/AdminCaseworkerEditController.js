angular
  .module('myApp')
  .controller('AdminCaseworkerEditController', ['UserService', '$http', '$location',
      function(UserService, $http, $location) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.caseworker = UserService.caseworker;
  vm.viewCaseworker = UserService.viewCaseworker;
  vm.editCaseworker = editCaseworker;
  vm.deleteCaseworker = deleteCaseworker;

  //Saves edits made to Caseworker record in the admin-caseworker-edit view
  function editCaseworker(caseworker) {
    console.log('Save changes clicked: ', caseworker);
    $http.put('/caseworkers/', caseworker).then(function() {
      console.log('saves edits ', caseworker);
      $location.path('/admin-caseworker-overview');
      alert('Your edits to ' + caseworker.first + caseworker.last + ' have been saved.');
    });
  }

  //Deletes selected Caseworker from the admin-caseworker-edit view
    function deleteCaseworker(caseworker) {
      console.log('Delete clicked: ', caseworker);
      if(confirm('Are you sure you want to delete ' + caseworker.first + ' ' +
                  caseworker.last + '?')) {
        $http.delete('/caseworkers/' + caseworker.id).then(function() {
          console.log('Deleted caseworker: ', caseworker.id);
          $location.path('/admin-caseworker-overview');
          alert(caseworker.first + ' ' + caseworker.last + ' has been deleted.');
          });
      } else {
        $location.path('/admin-caseworker-edit');
      }
    }

}]);
