angular
  .module('myApp')
  .controller('LoginController', ['UserService', function(UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.message = '';
  vm.tempUser = { // temp object used for login purposes
    email: '',
    password: ''
  };

  // DATA-BINDING FUNCTIONS
  vm.loginUser = function(tempUser) {
    if (tempUser.email === '' || tempUser.password === '') {
      vm.message = 'Please enter your email and password!';
    } else { // email & password not blank - attempt to login with the provided credentials
      vm.message = '';
      UserService.loginUser(tempUser).then(function(loginValue) {
        if (loginValue === 1) {
          UserService.redirectToAdminAppointmentsAll();
        } else if (loginValue === 2) {
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
