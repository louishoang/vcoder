angular.module('myApp.controllers',[])
  .controller('pageslideCtrl',['$scope',function($scope){
                $scope.checked = false; // This will be binded using the ps-open attribute
                $scope.toggle = function(){
                    $scope.checked = !$scope.checked
                }
            }])
  .controller('ClassRoomController', function($scope, SessionService){
    $scope.user = SessionService.currentUser.user;
});
