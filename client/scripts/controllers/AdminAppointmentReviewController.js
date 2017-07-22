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

//Model for ethnicities drop down
vm.ethnicities = ['African', 'American Indian or Alaska Native',
    'Asian or Pacific Islander', 'Black or African American', 'Hispanic',
    'Mixed Racial Background', 'White', 'Other'].map(function (ethnicity) {
        return { description: ethnicity }; });

//Model for States on State drop down
vm.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA ' +
    'MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT ' +
    'VA WA WV WI WY').split(' ').map(function (state) { return { abbrev: state }; });

  function editClient(client) {
    console.log('Updating client: ', client);
    $http.put('/clients', client).then(function() {
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
