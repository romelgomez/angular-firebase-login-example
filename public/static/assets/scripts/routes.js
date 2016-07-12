'use strict';

angular.module('routes',['ngRoute'])
  .constant('SECURED_ROUTES', {})
  .constant('LOGIN_REDIRECT_PATH', '/login')
  /**
   * Adds a special `whenAuthenticated` method onto $routeProvider. This special method,
   * when called, invokes Auth.$requireAuth() service (see Auth.js).
   *
   * The promise either resolves to the authenticated user object and makes it available to
   * dependency injection (see AccountCtrl), or rejects the promise if user is not logged in,
   * forcing a redirect to the /login page
   */
  .config(['$routeProvider', 'SECURED_ROUTES', function($routeProvider, SECURED_ROUTES) {
    // credits for this idea: https://groups.google.com/forum/#!msg/angular/dPr9BpIZID0/MgWVluo_Tg8J
    // unfortunately, a decorator cannot be use here because they are not applied until after
    // the .config calls resolve, so they can't be used during route configuration, so we have
    // to hack it directly onto the $routeProvider object
    $routeProvider.whenAuthenticated = function(path, route) {
      route.resolve = route.resolve || {};
      route.resolve.user = ['FireAuth', function(FireAuth) {
        return FireAuth.$requireSignIn();
      }];
      $routeProvider.when(path, route);
      SECURED_ROUTES[path] = true;
      return $routeProvider;
    };
  }])
  /**
   * configure views; whenAuthenticated adds a resolve method to ensure users authenticate
   * before trying to access that route
   */
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(true).hashPrefix('!');

    $routeProvider
      .when('/', {
        templateUrl: 'static/assets/views/main.html',
        controller: 'MainController'
      })
      .when('/login', {
        templateUrl: 'static/assets/views/login.html',
        controller: 'LoginController'
      })
      .whenAuthenticated('/account', {
        templateUrl: 'static/assets/views/account.html',
        controller: 'AccountController'
      })
      .otherwise({redirectTo: '/'});

  }])
  /**
   * Apply some route security. Any route's resolve method can reject the promise with
   * "AUTH_REQUIRED" to force a redirect. This method enforces that and also watches
   * for changes in auth status which might require us to navigate away from a path
   * that we can no longer view.
   */
  .run([
    '$rootScope',
    '$location',
    'FireAuth',
    'SECURED_ROUTES',
    'LOGIN_REDIRECT_PATH',
    function($rootScope, $location, FireAuth, SECURED_ROUTES, LOGIN_REDIRECT_PATH) {

      // watch for login status changes and redirect if appropriate
      FireAuth.$onAuthStateChanged(function (authenticatedUser) {

        // authenticatedUser : object or null
        if( !authenticatedUser && SECURED_ROUTES.hasOwnProperty($location.path())) {
          $location.path(LOGIN_REDIRECT_PATH);
        }

      });

      // some of our routes may reject resolve promises with the special {authRequired: true} error
      // this redirects to the login page whenever that is encountered
      $rootScope.$on('$routeChangeError', function(event, next, previous, error) {
        if( error.toString() === 'AUTH_REQUIRED' ) {
          $location.path(LOGIN_REDIRECT_PATH);
        }
      });

    }
  ]);
