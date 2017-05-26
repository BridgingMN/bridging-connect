angular
  .module('myApp')
  .controller('PasswordResetController', ['$routeParams', 'UserService', function($routeParams, UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.message = '';
  vm.tempUser = { // temp object used for login purposes
    email: '',
    password: ''
  };

  // DATA-BINDING FUNCTIONS
  vm.sendResetPassword = sendResetPassword;
  vm.updatePassword = updatePassword;

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

  function sendResetPassword () {
    if(vm.tempUser.email === '') {
      vm.message = 'Please enter a username.';
    } else {
      console.log('sending to server...', vm.tempUser);
      UserService.sendResetPasswordLink(vm.tempUser)
      .then(
        function (response) {
          vm.message = response;
        },
        function (error) {
          vm.message = error;
        }
      );
    }
  }


  function updatePassword () {
    console.log('Code: ', $routeParams.code);
    // Send our password reset request to the server
    // with our username, new password and code
    if(vm.tempUser.email === '' || vm.tempUser.password === '') {
      vm.message = 'Please enter a username and password.';
    } else {
      console.log('sending to server...', vm.tempUser);
      vm.tempUser.code = $routeParams.code;
      UserService.updateUserPassword(vm.tempUser)
        .then(function (response) {
          vm.message = response;
        });
      }
    }

  // CONTROLLER VARIABLES/FUNCTIONS
  function displayErrorMessage() {
    vm.message = 'Incorrect e-mail or password. Please try again.';
  }
}]); // END CONTROLLER
