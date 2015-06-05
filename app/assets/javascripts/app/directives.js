angular.module('myApp.directives', [])
  .directive("paginator", function(){
    return {
      restrict: 'CE',
      templateUrl : 'templates/paginator.html'
    }
  });
