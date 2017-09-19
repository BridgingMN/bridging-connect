angular
  .module('myApp')
  .controller('AdminAppointmentReviewController', ['$http', '$location', '$mdDialog','CONSTANTS', 'UserService',
      function($http, $location, $mdDialog, CONSTANTS, UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.CONSTANTS = CONSTANTS;
  vm.appointment = UserService.appointment;
  vm.viewDetails = UserService.viewDetails;
  vm.editClient = editClient;
  vm.confirmApt = confirmApt;
  vm.denyApt = denyApt;
  vm.cancelApt = cancelApt;
  vm.editDeliveryDate = editDeliveryDate;

  console.log('vm.appointment', vm.appointment);

  //Model for ethnicities drop down
  vm.ethnicities = ['African', 'American Indian or Alaska Native',
      'Asian or Pacific Islander', 'Black or African American', 'Hispanic',
      'Mixed Racial Background', 'White', 'Other'].map(function (ethnicity) {
          return { description: ethnicity }; });

  //Model for States on State drop down
  vm.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA ' +
      'MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT ' +
      'VA WA WV WI WY').split(' ').map(function (state) { return { abbrev: state }; });

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

  function editClient(client) {
    console.log('Updating client: ', client);
    $http.put('/clients', client).then(function(response) {
      console.log('response to client put request', response);
      $location.path('/admin-appointments-all');
      appointmentAlertDialog('Client Updated','Your edits to ' + client.first + ' ' + client.last + ' have been saved.');
    });
  }

  function confirmApt(appointment) {
    console.log('Confirming Appointment: ', appointment.appointment_id);
    $http.put('/appointments/update/' + appointment.appointment_id + '/' + 'confirmed')
      .then(function() {
      if(appointment.delivery_date === null) {
        $location.path('/admin-appointments-pending');
        appointmentAlertDialog('Appointment Confirmed', 'The appointment has been confirmed and a confirmation email has ' +
                'been sent to the caseworker.');
        } else {
          console.log('Updating Delivery Date to: ', appointment);
          $http.put('/appointments/update/deliverydate', appointment).then(function() {
            $location.path('/admin-appointments-pending');
            appointmentAlertDialog('Appointment Confirmed', 'The appointment has been confirmed with a delivery date ' +
                    'and an email has been sent to inform the caseworker.');
                  });
                }
              });
        }


  function denyApt(appointment) {
    console.log('Denied Appointment: ', appointment.appointment_id);
    $http.put('/appointments/update/' + appointment.appointment_id + '/' + 'denied')
      .then(function() {
        $location.path('/admin-appointments-all');
        appointmentAlertDialog('Appointment Denied', 'The appointment has been denied and an email has ' +
                'been sent to notify the caseworker.');
    });
  }

  function cancelApt(appointment) {
    console.log('Cancelled Appointment: ', appointment.appointment_id);
    $http.put('/appointments/update/' + appointment.appointment_id + '/' + 'canceled')
      .then(function() {
        $location.path('/admin-appointments-all');
        appointmentCanceledDialog();
    });
  }

  function editDeliveryDate(appointment) {
    console.log('Updating Delivery Date to: ', appointment);
    $http.put('/appointments/update/deliverydate', appointment).then(function() {
      $location.path('/admin-appointments-all');
      deliveryDateEditDialog();
    });
  }

  function appointmentAlertDialog(title, text) {
    $mdDialog.show(
     $mdDialog.alert()
       .clickOutsideToClose(true)
       .title(title)
       .textContent(text)
       .ok('Okay')
   );
  }

  function appointmentCanceledDialog() {
    $mdDialog.show(
     $mdDialog.alert()
       .clickOutsideToClose(true)
       .title('Appointment Canceled')
       .textContent('The appointment has been canceled and an email has ' +
               'been sent to notify the caseworker.')
       .ariaLabel('Appointment Canceled')
       .ok('Okay')
   );
  }

  function deliveryDateEditDialog() {
    $mdDialog.show(
     $mdDialog.alert()
       .clickOutsideToClose(true)
       .title('Delivery Date Updated')
       .textContent('The delivery date has been updated and an email has ' +
               'been sent to inform the caseworker.')
       .ariaLabel('Delivery Date Updated')
       .ok('Okay')
   );
  }
}]);
