myApp.controller('RegisterController', ['UserService', function(UserService) {
  console.log('register controller loaded');
  // DATA-BINDING VARIABLES
  var register = this; // controller reference
  register.message = ''; // used for error handling
  register.tempUser = { // temp object sent to back-end
    username: '',
    password: ''
  };

  // DATA-BINDING FUNCTIONS
  register.registerUser = function(tempUser) {
    if(tempUser.username === '' || tempUser.password === '') {
      register.message = 'Please enter an e-mail address and password.';
    } else {
      register.message = '';
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
    register.message = "Oops! Something went wrong. Please try again.";
  }
  
}]); // END CONTROLLER