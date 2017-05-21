angular
  .module('myApp')
  .factory('AppointmentService', ['$http', function ($http) {
    function Appointment(appointment_type) {
      this.appointment_type = appointment_type;
    }

    Appointment.prototype.setDeliveryType = function (delivery_method) {
      this.delivery_method = delivery_method;
      return this.delivery_method;
    };

    Appointment.prototype.submitZipCode = function (zip_code) {
      var rulesURL = '/rules/zip/' + zip_code;
      return $http.get(rulesURL).then(returnResponse, returnError);
    };

    Appointment.prototype.getAvailableAppointments = function (min_date, max_date) {
      var params = {
        min_date: min_date,
        max_date: max_date,
        appointment_type: this.appointment_type,
        delivery_method: this.delivery_method,
        location_id: this.loc.id
      };
      return $http.get('/appointments/available', {params: params})
        .then(returnResponse, returnError);
    };

    Appointment.prototype.submitAppointment = function (selectedAppointment) {
      this.appointment = selectedAppointment;
      console.log(this);
    };

    Appointment.prototype.createNewAppointment = function (clientReferralForm) {
      console.log('POSTing New Client');
      var appointmentInfo = this.appointment;
      console.log('appointmentInfo', appointmentInfo);
      return $http.post('/clients', {
        params: clientReferralForm
      }).then(function (response) {
        console.log('POSTING new appointment', response);
        return $http.post('/appointments/reserve', {
            user_id: 1,
            client_id: response.data.id,
            appointment_slot_id: appointmentInfo.appointment_slot_id,
            appointment_date: appointmentInfo.date,
            status: 'pending'
        }).then(returnResponse, returnError);
      });

    };

    return {
      Appointment: Appointment,
      getUserAppointments: getUserAppointments
    };



    function returnResponse(response) {
      console.log('Success', response );
      return response;
    }

    function returnError(error) {
      console.log('Error', error);
      return error;
    }

    function getUserAppointments() {
      return $http.get('/appointments/existing')
        .then( returnResponse, returnError);
    }

  }]);
