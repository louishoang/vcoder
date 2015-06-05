angular.module('myApp.directives', [])
  .directive("paginator", function(){
    return {
      restrict: 'CE',
      templateUrl : 'templates/paginator.html'
    }
  })
  .directive('searchPaginator', function(){
    return {
      restrict: 'CE',
      templateUrl : 'templates/search_paginator.html'
    }
  });
