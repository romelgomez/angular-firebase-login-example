'use strict';

angular.module('fire3',['firebase'])
  .constant('FIRE_BASE_CONFIG', {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    storageBucket: ''
  })
  .config(['FIRE_BASE_CONFIG', function (FIRE_BASE_CONFIG) {
    firebase.initializeApp(FIRE_BASE_CONFIG);
  }])
  .factory('FireAuth', ['$firebaseAuth', function($firebaseAuth) {
    return $firebaseAuth();
  }])
  .factory('FireRef', ['$window', function($window) {
    return $window.firebase.database().ref();
  }]);