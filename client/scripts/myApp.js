angular
  .module('myApp', ['ngRoute', 'ngMaterial', 'md.data.table'])
  .config(['$locationProvider', '$routeProvider', config]);
// -----ROUTES-----
function config($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('');
  $routeProvider
    .when('/login', {
      templateUrl: '/views/templates/login.html',
      controller: 'LoginController',
      controllerAs: 'vm'
    })
    .when('/register', {
      templateUrl: '/views/templates/register.html',
      controller: 'RegisterController',
      controllerAs: 'vm'
    })
    .when('/user', {
      templateUrl: '/views/templates/user.html',
      controller: 'UserController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-appointments-pending', {
      templateUrl: '/views/templates/admin-appointments-pending.html',
      controller: 'AdminAppointmentsPendingController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-appointments-all', {
      templateUrl: '/views/templates/admin-appointments-all.html',
      controller: 'AdminAppointmentsAllController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-appointments-default', {
      templateUrl: '/views/templates/admin-appointments-default.html',
      controller: 'AdminAppointmentsDefaultController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-appointments-customize', {
      templateUrl: '/views/templates/admin-appointments-customize.html',
      controller: 'AdminAppointmentsCustomizeController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-appointments-export', {
      templateUrl: '/views/templates/admin-appointments-export.html',
      controller: 'AdminAppointmentsExportController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-caseworker-overview', {
      templateUrl: '/views/templates/admin-caseworker-overview.html',
      controller: 'AdminCaseworkerOverviewController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-caseworker-new', {
      templateUrl: '/views/templates/admin-caseworker-new.html',
      controller: 'AdminCaseworkerNewController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-caseworker-edit', {
      templateUrl: '/views/templates/admin-caseworker-edit.html',
      controller: 'AdminCaseworkerEditController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-caseworker-import', {
      templateUrl: '/views/templates/admin-caseworker-import.html',
      controller: 'AdminCaseworkerImportController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-agency-overview', {
      templateUrl: '/views/templates/admin-agency-overview.html',
      controller: 'AdminAgencyOverviewController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-agency-new', {
      templateUrl: '/views/templates/admin-agency-new.html',
      controller: 'AdminAgencyNewController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-agency-edit', {
      templateUrl: '/views/templates/admin-agency-edit.html',
      controller: 'AdminAgencyEditController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/caseworker-appointment-new', {
      templateUrl: '/views/templates/caseworker-appointment-new.html',
      controller: 'CaseworkerAppointmentNewController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/caseworker-appointment-location', {
      templateUrl: '/views/templates/caseworker-appointment-location.html',
      controller: 'CaseworkerAppointmentLocationController',
      controllerAs: 'vm',
      // resolve: { // get user from factory
      //   getuser : ['UserService', function(UserService){
      //     return UserService.getUser();
      //   }]
      // }
    })
    .when('/caseworker-appointment-zipcode', {
      templateUrl: '/views/templates/caseworker-appointment-zipcode.html',
      controller: 'CaseworkerAppointmentZipcodeController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/caseworker-appointment-schedule', {
      templateUrl: '/views/templates/caseworker-appointment-schedule.html',
      controller: 'CaseworkerAppointmentScheduleController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/caseworker-appointment-reschedule', {
      templateUrl: '/views/templates/caseworker-appointment-reschedule.html',
      controller: 'CaseworkerAppointmentRescheduleController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/caseworker-appointment-form', {
      templateUrl: '/views/templates/caseworker-appointment-form.html',
      controller: 'CaseworkerAppointmentFormController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/caseworker-appointment-edit-form', {
      templateUrl: '/views/templates/caseworker-appointment-edit-form.html',
      controller: 'CaseworkerAppointmentEditFormController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/caseworker-appointments-all', {
      templateUrl: '/views/templates/caseworker-appointments-all.html',
      controller: 'CaseworkerAppointmentsAllController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .otherwise({
      redirectTo: 'login'
    });
}
