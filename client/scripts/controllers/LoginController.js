angular
  .module('myApp')
  .controller('LoginController', ['UserService', function(UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.message = '';
  vm.tempUser = { // temp object used for login purposes
    username: '',
    password: ''
  };
  
  // DATA-BINDING FUNCTIONS
  vm.loginUser = function(tempUser) {
    if (tempUser.username === '' || tempUser.password === '') {
      vm.message = 'Please enter your username and password!';
    } else { // username & password not blank - attempt to login with the provided credentials
      vm.message = '';
      UserService.loginUser(tempUser).then(function(loginValue) {
        if (loginValue === 'admin') {
          UserService.redirectToAdminAppointmentsPending();
        } else if (loginValue === 'caseworker') {
          UserService.redirectToCaseworkerAppointmentsAll();
        } else {
          displayErrorMessage();
        }
      });
    }
  };

  // CONTROLLER VARIABLES/FUNCTIONS
  function displayErrorMessage() {
    vm.message = 'Incorrect e-mail or password. Please try again.';
  }
}]); // END CONTROLLER