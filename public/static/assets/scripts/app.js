'use strict';

angular.module('app',[
    'angular-loading-bar',
    'validators',
    'firebase',
    'fire3',
    'routes',
    'login',
    'account',
    'ui.bootstrap',
    'main',
    'filters',
    'jlareau.pnotify'
  ])
  .controller('AppController',[ '$scope', 'FireAuth',function( $scope, FireAuth){

    FireAuth.$onAuthStateChanged(function(firebaseUser) {
      $scope.firebaseUser = firebaseUser;
    });

    $scope.logout = function() { FireAuth.$signOut(); };

  }]);
