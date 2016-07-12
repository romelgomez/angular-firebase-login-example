'use strict';

angular.module('account',['trTrustpass','ngPasswordStrength'])
  .controller('AccountController',[
    '$scope',
    '$q',
    'user',
    '$uibModal',
    'FireRef',
    '$firebaseObject',
    function ($scope, $q, user, $uibModal, FireRef, $firebaseObject) {

      $scope.lording = {
        deferred: $q.defer(),
        isDone: false,
        promises: []
      };

      $scope.lording.promise = $scope.lording.deferred.promise;

      $scope.account = {
        user:user,
        profile: $firebaseObject(FireRef.child('users/'+user.uid))
      };

      $scope.lording.promises.push($scope.account.profile.$loaded());

      // You can pass $scope.lording.promises to a directive, to add more promises, and then later resolve the main promise.
      $q.all($scope.lording.promises)
        .then(function(){
          $scope.lording.deferred.resolve();
          $scope.lording.isDone = true;
        });

    }])
  .controller('AccountProfileController',[
    '$scope',
    '$uibModal',
    'notificationService',
    function($scope, $uibModal, notificationService){


      $scope.changeProfileDetails = function(size){
        var modalInstance = $uibModal.open({
          templateUrl: 'accountProfileDetailsModal.html',
          controller: 'AccountProfileDetailsModalController',
          size: size,
          resolve: {
            profile: function () {
              return $scope.account.profile;
            }
          }
        });

        modalInstance.result.then(function () {
          notificationService.success('The profile has been updated.');
        });
      };


    }])
  .controller('AccountProfileDetailsModalController',[
    '$scope',
    '$uibModalInstance',
    '$q',
    'profile',
    function($scope, $uibModalInstance, $q, profile){

      $scope.forms = {
        profileDetails: {}
      };

      $scope.profile = profile;

      $scope.model = {
        names:                angular.isDefined(profile.names) && profile.names !== '' ? profile.names : '',
        lastNames:            angular.isDefined(profile.lastNames) && profile.lastNames !== '' ? profile.lastNames : '',
        email:                angular.isDefined(profile.email) && profile.email !== '' ? profile.email : '',
        twitterAccount:       angular.isDefined(profile.twitterAccount) && profile.twitterAccount !== '' ? profile.twitterAccount : '',
        facebookAccount:      angular.isDefined(profile.facebookAccount) && profile.facebookAccount !== '' ? profile.facebookAccount : ''
      };

      $scope.submit = function(){
        if($scope.forms.profileDetails.$valid){

          angular.forEach($scope.model, function(value, key){
            profile[key] = value;
          });

          $scope.httpRequestPromise = profile.$save()
            .then(function() {
              $uibModalInstance.close();
            }, function(error) {
              $uibModalInstance.dismiss(error);
            });

        }
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss();
      };

    }]);
