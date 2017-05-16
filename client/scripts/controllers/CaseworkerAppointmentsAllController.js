angular
  .module('myApp')
  .controller('CaseworkerAppointmentsAllController', ['UserService', function(UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference

  vm.caseworkerAppointments = [
    {
      appointment_date: new Date(),
      delivery_date: new Date(),
      client_first: 'Rodney',
      client_last: 'Toddney',
      client_street: '123 Fake Street',
      appointment_type: 'Shopping',
      location: 'Bloomington',
      delivery_type: 'Delivery',
      start_time: '9:15 AM'
    },
    {
      appointment_date: new Date(),
      delivery_date: new Date(),
      client_first: 'Rodney',
      client_last: 'Toddney',
      client_street: '123 Fake Street',
      appointment_type: 'Shopping',
      location: 'Bloomington',
      delivery_type: 'Delivery',
      start_time: '9:15 AM'
    },
    {
      appointment_date: new Date(),
      delivery_date: new Date(),
      client_first: 'Rodney',
      client_last: 'Toddney',
      client_street: '123 Fake Street',
      appointment_type: 'Shopping',
      location: 'Bloomington',
      delivery_type: 'Delivery',
      start_time: '9:15 AM'
    },
    {
      appointment_date: new Date(),
      delivery_date: new Date(),
      client_first: 'Rodney',
      client_last: 'Toddney',
      client_street: '123 Fake Street',
      appointment_type: 'Shopping',
      location: 'Bloomington',
      delivery_type: 'Delivery',
      start_time: '9:15 AM'
    },
    {
      appointment_date: new Date(),
      delivery_date: new Date(),
      client_first: 'Rodney',
      client_last: 'Toddney',
      client_street: '123 Fake Street',
      appointment_type: 'Shopping',
      location: 'Bloomington',
      delivery_type: 'Delivery',
      start_time: '9:15 AM'
    },
    {
      appointment_date: new Date(),
      delivery_date: new Date(),
      client_first: 'Rodney',
      client_last: 'Toddney',
      client_street: '123 Fake Street',
      appointment_type: 'Shopping',
      location: 'Bloomington',
      delivery_type: 'Delivery',
      start_time: '9:15 AM'
    },
    {
      appointment_date: new Date(),
      delivery_date: new Date(),
      client_first: 'Rodney',
      client_last: 'Toddney',
      client_street: '123 Fake Street',
      appointment_type: 'Shopping',
      location: 'Bloomington',
      delivery_type: 'Delivery',
      start_time: '9:15 AM'
    },
    {
      appointment_date: new Date(),
      delivery_date: new Date(),
      client_first: 'Rodney',
      client_last: 'Toddney',
      client_street: '123 Fake Street',
      appointment_type: 'Shopping',
      location: 'Bloomington',
      delivery_type: 'Delivery',
      start_time: '9:15 AM'
    }

  ];

}]);
