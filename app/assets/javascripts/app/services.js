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
  })
  .factory("Student", ["$resource", function($resource){
    return $resource("/students/:id", {id: "@id"},
      {
      'create':  { method: 'POST' },
      'index':   { method: 'GET'},
      'show':    { method: 'GET', isArray: false },
      'update':  { method: 'PUT' },
      'destroy': { method: 'DELETE' }
      }
    );
  }])
  .factory("Announcement", ["$resource", function($resource){
    return $resource("/announcements/:id", {id: "@id"},
      {
      'create':  { method: 'POST' },
      'index':   { method: 'GET'},
      'show':    { method: 'GET', isArray: false },
      'update':  { method: 'PUT' },
      'destroy': { method: 'DELETE' }
      }
    );
  }])
  .factory("FirebaseAnnouncement",
          ["$firebase", "$firebaseArray",
           function($firebase, $firebaseArray){
    var ref = new Firebase("https://vcoder.firebaseio.com/announcements");

    var announcements = $firebaseArray(ref);

    var announcementServiceObject = {
      announcements: announcements,
      saveAnnouncement: function(announcement){
        announcements.$add(announcement);
      },
      removeAnnouncement: function(announcement){
        announcements.$remove(announcement);
      }
    };

    return announcementServiceObject;
  }])
  .factory("PaginationService", function(){
    return function($scope, section) {
      $scope.sortType = "email";
      $scope.sortReverse = false;
      $scope.searchTerm = '';
      $scope.itemsPerPage = 25;
      $scope.currentPage = 0;

      $scope.prevPage = function() {
        if ($scope.currentPage > 0) {
          $scope.currentPage--;
        }
      };

      $scope.nextPage = function() {
        if ($scope.currentPage < $scope.pageCount - 1){
          $scope.currentPage++;
        }
      };

      $scope.getPageCount = function(){
        var array = new Array();
        for(i = 1; i <= $scope.pageCount; i ++){
          array.push(i);
        }
        return array;
      };

      $scope.startFrom = function(){
        return $scope.itemsPerPage * $scope.currentPage;
      };

      $scope.setPage = function(n){
        $scope.currentPage = n - 1;
      };

      $scope.$watch('currentPage', function(){
        $scope.startFrom = $scope.itemsPerPage * $scope.currentPage;
      });
    }
  });
