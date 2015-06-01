angular.module('myApp',
               ['ngRoute',
               'ngResource',
               'myApp.controllers',
               'myApp.services',
               'pageslide-directive',
               'firebase',
               'restangular'])
  .config(function($routeProvider){
    $routeProvider.when('/', {
      templateUrl: '/templates/dashboard.html',
      controller: 'ClassRoomController',
      resolve: {
        session: function(SessionService){
          return SessionService.getCurrentUser();
        }
      }
    })
    .when('/students', {
      templateUrl: '/templates/admin/student.html',
      controller: 'StudentsController'
    })
  .otherwise({redirectTo: '/'});
});
