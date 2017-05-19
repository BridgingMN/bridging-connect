angular
  .module('myApp')
  .factory('AppointmentService', ['$http', function ($http) {
    function Appointment(appointment_type) {
      this.appointment_type = appointment_type;
      this.location = {
        location_id: 1
      };
    }

    Appointment.prototype.setDeliveryType = function (delivery_method) {
      this.delivery_method = delivery_method;
      return this.delivery_method;
    };

    Appointment.prototype.setZipcode = function (zip_code) {
      var rulesURL = '/rules/zip/' + zip_code;
      return $http.get(rulesURL).then(setLocation, returnError);
    };

    Appointment.prototype.getAvailableAppointments = function (min_date, max_date) {
      var params = {
        min_date: min_date,
        max_date: max_date,
        appointment_type: this.appointment_type,
        delivery_method: this.delivery_method,
        location_id: this.location.location_id
      };
      return $http.get('/appointments/available', {params: params})
        .then(returnResponse, returnError);
    };

    Appointment.prototype.submitAppointment = function (selectedAppointment) {
      this.appointment = selectedAppointment;
    };

    Appointment.prototype.createNewAppointment = function (clientReferralForm) {
      return $http.post('/clients', {
        params: clientReferralForm
      }).then(function (response) {
        return $http.post('/appointments/reserve', {
          params: {
            user_id: 1,
            client_id: response,
            appointment_slot_id: this.appointment.appointment_slot_id,
            appointment_date: this.appointment.date,
            status: 'pending'
          }
        }).then(returnResponse, returnError);
      });

    };

    return {
      Appointment: Appointment
    };

    function setLocation(location) {
      console.log(location);
      this.location = location;
      return this.location;
    }

    function returnResponse(response) {
      console.log('Success', response );
      return response;
    }

    function returnError(error) {
      console.log('Error', error);
      return error;
    }

  }]);
