angular.module('myApp',
               ['ngRoute',
               'ngResource',
               'myApp.controllers',
               'myApp.services',
               'pageslide-directive'])
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
  .otherwise({redirectTo: '/'});
});
