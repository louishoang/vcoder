angular.module('myApp.services', ['ngResource'])
.factory("SessionService", function($http, $q){
  var service = {
    currentUser: null,
    isAuthenticated: function(){
      return !!service.currentUser;
    },
    getCurrentUser: function(){
      if(service.isAuthenticated()){
        return $q.when(service.currentUser);
      } else {
        return $http.get('/api/current_user').then(function(resp){
          return service.currentUser = resp.data;
        });
      }
    }
  };
  return service;
});
