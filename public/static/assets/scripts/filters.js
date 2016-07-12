'use strict';

angular.module('filters',[])
  /**
   * @Description trim
   * @source http://stackoverflow.com/questions/30506300/how-do-i-trim-a-string-in-angularjs
   */
  .filter('trim', function () {
    return function(value) {
      if(!angular.isString(value)) {
        return value;
      }
      return value.replace(/^\s+|\s+$/g, ''); // you could use .trim, but it's not going to work in IE<9
    };
  })
/**
 *  @Description  All first letters of each word will be capital letters.
 *
 *  EXAMPLE: {{ 'hello word' | capitalize }} // Hello Word
 *
 *  @param {String}
 *  @return {String}
 * */
  .filter('capitalize', [function() {
    return function(input) {
      return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    };
  }])
/**
 * @Description All first letters of each word will be capital letters. (NOTE: The filter directive is to directly use in forms inputs)
 * @source http://stackoverflow.com/a/14425022/2513972
 */
  .directive('capitalize', ['$filter',function($filter){
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, modelCtrl) {

        modelCtrl.$parsers.push(function (inputValue) {
          var transformedInput = $filter('capitalize')(inputValue);
          if (transformedInput!=inputValue) {
            modelCtrl.$setViewValue(transformedInput);
            modelCtrl.$render();
          }
          return transformedInput;
        });
      }
    };
  }])
/**
 * @Description Slug or lispCase; All letters are downCased and spaces and specialChars are replaced by hyphens '-'.
 *
 * EXAMPLE: {{ 'Your best days are not behind you; your best days are out in front of you.' | slug }} // your-best-days-are-not-behind-you-your-best-days-are-out-in-front-of-you
 *
 * @param {String}
 * @return {String}
 * */
  .filter('slug', [function() {
    return function(input) {
      return (!!input) ? String(input).toLowerCase().replace(/[^a-zá-źA-ZÁ-Ź0-9]/g, ' ').trim().replace(/\s{2,}/g, ' ').replace(/\s+/g, '-') : '';
    };
  }])
/**
 * @Description  All special chars are replaced by spaces.
 * @param {String}
 * @return {String}
 * */
  .filter('noSpecialChars', [function() {
    return function(input) {
      return (!!input) ? String(input).replace(/[^a-zá-źA-ZÁ-Ź0-9]/g, ' ').trim().replace(/\s{2,}/g, ' ') : '';
    };
  }])
/**
 * @Description Receives one string like: 'hello word' and return 'Hello word'
 * @param {String}
 * @return {String}
 */
  .filter('capitalizeFirstChar', [function() {
    return function(input) {
      return (!!input) ? input.trim().replace(/(^\w?)/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1);}) : '';
    };
  }])
  /**
   * @Description first letter will be capital letter. (NOTE: The filter directive is to directly use in forms inputs)
   * @source http://stackoverflow.com/a/14425022/2513972
   */
  .directive('capitalizeFirstChar', ['$filter',function($filter){
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, modelCtrl) {

        modelCtrl.$parsers.push(function (inputValue) {
          var transformedInput = $filter('capitalizeFirstChar')(inputValue);
          if (transformedInput!=inputValue) {
            modelCtrl.$setViewValue(transformedInput);
            modelCtrl.$render();
          }
          return transformedInput;
        });
      }
    };
  }])
/**
 * @Description Add one more step before apply the 'date' filter of angular. The raw data is first passed through Date.parse(input) before apply the 'date' filter of angular.
 * The idea is get the integer format: Date.parse('2015-01-19 14:12:15') // 142169293500, before apply the 'date' filter of angular.
 *
 *  EXAMPLE:
 *  var created = '2015-01-19 14:12:15';
 *  $scope.created = $filter('dateParse')(created,'dd/MM/yyyy - hh:mm a');
 *  {{created}} // 19/01/2015 - 02:12 PM
 *
 *  For more ifo see the API https://docs.angularjs.org/api/ng/filter/date
 *
 * @param  {String} Date Format '2015-01-19 14:12:15'
 * @return {String}
 */
  .filter('dateParse', ['$window','$filter',function($window,$filter) {
    return function(input,format,timezone) {
      return (!!input) ? $filter('date')( $window.Date.parse(input), format, timezone) : '';
    };
  }])
/**
 * @Description Replace part of the string.
 *
 *  EXAMPLE:
 *  var partOfTheUrl   = 'search-angular-filters';
 *  $scope.searchString   = $filter('stringReplace')(partOfTheUrl,'search-','');
 *  {{searchString}} // angular-filters
 *
 * @param  {String} Source string
 * @param  {String} Target string
 * @param  {String} New string
 * @return {String}
 * */
  .filter('stringReplace', [function() {
    return function(string,changeThis,forThis) {
      return string.split(changeThis).join(forThis);
    };
  }])
/**
 * @Description receives one array like: [1,2,3] and return [3,2,1]
 * @param  {Array}
 * @return {Array}
 * */
  .filter('reverse', [function() {
    return function(items) {
      return angular.isArray(items)? items.slice().reverse() : [];
    };
  }])
/**
 * @Description camelCase filter, receives one string like: 'hello word' and return 'helloWord'
 * @param  {String}
 * @return {String}
 * */
  .filter('camelCase', [function() {
    return function(input) {
      return  (!!input) ? input.trim().replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) { if (+match === 0){ return ''; } return index === 0 ? match.toLowerCase() : match.toUpperCase(); }) : '';
    };
  }])
  /**
   * @Description camelCase filter, receives one string like: 'hello word' and return 'helloWord'
   * @source http://stackoverflow.com/a/14425022/2513972
   */
  .directive('camelCase', ['$filter',function($filter){
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, modelCtrl) {

        modelCtrl.$parsers.push(function (inputValue) {
          var transformedInput = $filter('camelCase')(inputValue);
          if (transformedInput!=inputValue) {
            modelCtrl.$setViewValue(transformedInput);
            modelCtrl.$render();
          }
          return transformedInput;
        });
      }
    };
  }])
/**
 * @Description lispCase To CamelCase, receives one string like: 'hello-word' and return 'helloWord'
 * @param  {String}
 * @return {String}
 */
  .filter('lispCaseToCamelCase', [function() {
    return function(input) {
      return  (!!input) ? input.trim().replace(/[\-_](\w)/g, function(match) { return match.charAt(1).toUpperCase(); }) : '';
    };
  }])
/**
 * @Description AngularJS byte format filter
 * Source: https://gist.github.com/thomseddon/3511330
 */
  .filter('bytes', [function() {
    return function(bytes, precision) {
      if (isNaN(parseFloat(bytes)) || !isFinite(bytes)){ return '-'; }
      if (typeof precision === 'undefined'){ precision = 1; }
      var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
        number = Math.floor(Math.log(bytes) / Math.log(1024));
      return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
    };
  }])
/**
 * @Description Output plain text instead of html
 * Source: http://stackoverflow.com/a/17315483/2513972
 */
  .filter('htmlToPlaintext', [function() {
    return function(text) {
      return  text ? String(text).replace(/<[^>]+>/gm, ' ').trim() : '';
    };
  }])
  /**
   * @Description use $sce.trustAsHtml(string) to replicate ng-bind-html-unsafe in Angular 1.2+
   * Source: http://stackoverflow.com/questions/18340872/how-do-you-use-sce-trustashtmlstring-to-replicate-ng-bind-html-unsafe-in-angu
   */
  .filter('unsafe', ['$sce',function($sce) { return $sce.trustAsHtml; }])
  /**
   * @Description remove the file Extension, exp: 'name.exe' will return 'name'
   */
  .filter('removeFileExtension', ['$filter',function($filter) {
    return function(fileName) {
      return  fileName ? $filter('stringReplace')(fileName,'.'+fileName.split('.').pop(),'').trim() : '';
    };
  }])
  .filter('lodashJoin', ['$window',function($window) {
    return function(matrix, separator) {
      return  matrix ? $window._.join(matrix, separator).trim() : '';
    };
  }]);