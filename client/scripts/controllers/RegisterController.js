angular
  .module('myApp')
  .controller('RegisterController', ['UserService', function(UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.message = ''; // used for error handling
  vm.tempUser = { // temp object sent to back-end
    username: '',
    password: ''
  };

  // DATA-BINDING FUNCTIONS
  vm.registerUser = function(tempUser) {
    if(tempUser.username === '' || tempUser.password === '') {
      vm.message = 'Please enter an e-mail address and password.';
    } else {
      vm.message = '';
      UserService.registerUser(tempUser)
        .then(alertSuccess, displayErrorMessage);
    }
  };

  // CONTROLLER VARIABLES/FUNCTIONS
  function alertSuccess(response) { // alert for successful registration
    alert('Success! You may now login.');
    UserService.redirectToLogin();
  }

  function displayErrorMessage(httpError) { // message to display on registration error
    vm.message = "Oops! Something went wrong. Please try again.";
  }
  
}]); // END CONTROLLER