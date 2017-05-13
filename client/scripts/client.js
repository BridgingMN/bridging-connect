var myApp = angular.module('myApp', ['ngRoute', 'ngMaterial']);
// -----ROUTES-----
myApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('');
  $routeProvider
    .when('/login', {
      templateUrl: '/views/templates/login.html',
      controller: 'LoginController',
      controllerAs: 'login'
    })
    .when('/register', {
      templateUrl: '/views/templates/register.html',
      controller: 'RegisterController',
      controllerAs: 'register'
    })
    .when('/user', {
      templateUrl: '/views/templates/user.html',
      controller: 'UserController',
      controllerAs: 'user',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-appointments-pending', {
      templateUrl: '/views/templates/admin-appointments-pending.html',
      controller: 'AdminAppointmentsPending',
      controllerAs: 'adminAppointmentsPending',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-appointments-all', {
      templateUrl: '/views/templates/admin-appointments-all.html',
      controller: 'AdminAppointmentsAll',
      controllerAs: 'adminAppointmentsAll',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-appointments-default', {
      templateUrl: '/views/templates/admin-appointments-default.html',
      controller: 'AdminAppointmentsDefault',
      controllerAs: 'adminAppointmentsDefault',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-appointments-customize', {
      templateUrl: '/views/templates/admin-appointments-customize.html',
      controller: 'AdminAppointmentsCustomize',
      controllerAs: 'adminAppointmentsCustomize',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-appointments-export', {
      templateUrl: '/views/templates/admin-appointments-export.html',
      controller: 'AdminAppointmentsExport',
      controllerAs: 'adminAppointmentsExport',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-caseworker-overview', {
      templateUrl: '/views/templates/admin-caseworker-overview.html',
      controller: 'AdminCaseworkerOverview',
      controllerAs: 'adminCaseworkerOverview',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-caseworker-new', {
      templateUrl: '/views/templates/admin-caseworker-new.html',
      controller: 'AdminCaseworkerNew',
      controllerAs: 'adminCaseworkerNew',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-caseworker-edit', {
      templateUrl: '/views/templates/admin-caseworker-edit.html',
      controller: 'AdminCaseworkerEdit',
      controllerAs: 'adminCaseworkerEdit',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-caseworker-import', {
      templateUrl: '/views/templates/admin-caseworker-import.html',
      controller: 'AdminCaseworkerImport',
      controllerAs: 'adminCaseworkerImport',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-agency-overview', {
      templateUrl: '/views/templates/admin-agency-overview.html',
      controller: 'AdminAgencyOverview',
      controllerAs: 'adminAgencyOverview',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-agency-new', {
      templateUrl: '/views/templates/admin-agency-new.html',
      controller: 'AdminAgencyNew',
      controllerAs: 'adminAgencyNew',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-agency-edit', {
      templateUrl: '/views/templates/admin-agency-edit.html',
      controller: 'AdminAgencyEdit',
      controllerAs: 'adminAgencyEdit',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/caseworker-appointment-new', {
      templateUrl: '/views/templates/caseworker-appointment-new.html',
      controller: 'CaseworkerAppointmentNew',
      controllerAs: 'caseworkerAppointmentNew',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/caseworker-appointment-zipcode', {
      templateUrl: '/views/templates/caseworker-appointment-zipcode.html',
      controller: 'CaseworkerAppointmentZipcode',
      controllerAs: 'caseworkerAppointmentZipcode',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/caseworker-appointment-schedule', {
      templateUrl: '/views/templates/caseworker-appointment-schedule.html',
      controller: 'CaseworkerAppointmentSchedule',
      controllerAs: 'caseworkerAppointmentSchedule',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/caseworker-appointment-form', {
      templateUrl: '/views/templates/caseworker-appointment-form.html',
      controller: 'CaseworkerAppointmentForm',
      controllerAs: 'caseworkerAppointmentForm',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/caseworker-appointment-edit', {
      templateUrl: '/views/templates/caseworker-appointment-edit.html',
      controller: 'CaseworkerAppointmentEdit',
      controllerAs: 'caseworkerAppointmentEdit',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .when('/caseworker-appointments-all', {
      templateUrl: '/views/templates/caseworker-appointments-all.html',
      controller: 'CaseworkerAppointmentsAll',
      controllerAs: 'caseworkerAppointmentsAll',
      resolve: { // get user from factory
        getuser : ['UserService', function(UserService){
          return UserService.getUser();
        }]
      }
    })
    .otherwise({
      redirectTo: 'login'
    });
}]);
