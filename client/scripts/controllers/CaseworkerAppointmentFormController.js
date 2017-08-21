  angular
  .module('myApp')
  .controller('CaseworkerAppointmentFormController', ['$location', 'CONSTANTS', 'UserService', function($location, CONSTANTS, UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.CONSTANTS = CONSTANTS;

  //Model for the appointment info header
  vm.appointment = UserService.newAppointment;
  console.log('UserService in form controller', UserService);

  //Model for the clientReferralForm
  vm.clientReferralForm = {
    dob: new Date()
  };

  //These are placeholders, these will be properties of the clientReferralForm object
  vm.clientDateOfBirth = new Date();
  vm.clientEthnicity = '';

  //Model for ethnicities drop down
  vm.ethnicities = ['African', 'American Indian or Alaska Native',
        'Asian or Pacific Islander', 'Black or African American', 'Hispanic',
        'Mixed Racial Background', 'White', 'Other']
        .map(function (ethnicity) { return { description: ethnicity }; });

  //Model for States on State drop down
  vm.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
            'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
            'WY').split(' ').map(function (state) { return { abbrev: state }; });

  //Model for Counties drop down
  vm.counties = ['Aitkin', 'Anoka', 'Becker', 'Beltrami', 'Benton', 'Big Stone',
          'Blue Earth', 'Brown', 'Carlton', 'Carver', 'Cass', 'Chippewa', 'Chisago',
          'Clay', 'Clearwater', 'Cook', 'Cottonwood', 'Crow Wing', 'Dakota', 'Dodge',
          'Douglas', 'Faribault', 'Fillmore', 'Goodhue', 'Grant', 'Hennepin',
          'Houston', 'Hubbard', 'Isanti', 'Itasca', 'Jackson', 'Kanabec', 'Kandiyohi',
          'Kittson', 'Koochiching', 'Lac qui Parle', 'Lake', 'Lake of the Woods',
          'Le Sueur', 'Lincoln', 'Lyon', 'Mahnomen', 'Marshall', 'Martin', 'McLeod',
          'Meeker', 'Mille Lacs', 'Morrison', 'Mower', 'Murray', 'Nicollet',
          'Nobles', 'Norman', 'Olmsted', 'Otter Tail', 'Pennington', 'Pine',
          'Pipestone', 'Polk', 'Pope', 'Ramsey', 'Red Lake', 'Redwood', 'Renville',
          'Rice', 'Rock', 'Roseau', 'Scott', 'Sherburne', 'Sibley', 'St. Louis',
          'Stearns', 'Steele', 'Stevens', 'Swift', 'Todd', 'Traverse', 'Wabasha',
          'Wadena', 'Waseca', 'Washington', 'Watonwan', 'Wilkin', 'Winona',
          'Wright', 'Yellow Medicine', 'Not Listed']
          .map(function (county) { return { description: county }; });

  //Model for Marital Status drop down
  vm.statuses = ['Married', 'Single, Separated, Widowed, or Divorced', ]
                .map(function (marital) { return { description: marital }; });

  //Model for Marital Status drop down
  vm.sexes = ['Female', 'Male']
              .map(function (sex) { return { description: sex }; });

  //Model for Yearly Income drop down
  vm.incomes = ['Under $5,000', '$5,000 - $9,999', '$10,000 - $14,999',
              '$15,000 - $20,000', 'Over $20,000']
              .map(function(income) { return { description: income}; });

  //Model for Length of Homelessness drop down
  vm.homeless = ['Less than 1 Month', '1-3 Months', '4-12 Months',
              'Over 12 Months', 'Was not homeless']
              .map(function(length) { return { description: length}; });

  //Model for What Brought client to Bridging drop down
  vm.bridging = ['Disability', 'Domestic Violence', 'Foreclosure/Loss of Home',
              'Immigration', 'Job Loss', 'Leaving Prison', 'Medical Bills',
              'Mental Health', 'Natural Disaster', 'Persistent Low Income',
              'Substance Abuse', 'Bed Bug Infestation']
              .map(function(reason) { return { description: reason}; });

  //Model for Who is Paying drop downs
  vm.bank = ['Referring Agency', 'Client or Other Paying Referring Agency',
              'Client Paying Bridging', 'Other Paying Bridging']
              .map(function(payer) { return { description: payer}; });

  //Methods
  vm.submitClientForm = submitClientForm;

  //This function should call method from the service that posts the clientReferralForm and the appointment to the database and then redirects the caseworker to the appointment dashboard
  function submitClientForm() {
    UserService.newAppointment.createNewAppointment(vm.clientReferralForm)
      .then(appointmentCreateSuccess, appointmentCreateError);
  }

  function appointmentCreateSuccess(response) {
    console.log(response);
    UserService.navBar.updateCurrentNavItem('/caseworker-appointments-all');
    $location.path('/caseworker-appointments-all');
  }

  function appointmentCreateError(error) {
    console.error('Failed to create appointment', error);
  }

}]);
