myApp.controller('LoginController', ['$http', 'UserService', function($http, UserService) {
  // DATA-BINDING VARIABLES
  var login = this; // controller reference
  login.message = '';
  login.tempUser = { // temp object used for login purposes
    username: '',
    password: ''
  };
  
  // DATA-BINDING FUNCTIONS
  login.loginUser = function(tempUser) {
    if (tempUser.username === '' || tempUser.password === '') {
      login.message = 'Please enter your username and password!';
    } else { // username & password not blank - attempt to login with the provided credentials
      login.message = '';
      UserService.loginUser(tempUser).then(function(loginSuccess) {
        if (loginSuccess) {
          UserService.redirectToUser();
        } else {
          displayErrorMessage();
        }
      });
    }
  };

  // CONTROLLER VARIABLES/FUNCTIONS
  function displayErrorMessage() {
    login.message = 'Incorrect e-mail or password. Please try again.';
  }
}]); // END CONTROLLER