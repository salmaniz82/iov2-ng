/**
 * An AngularJS directive for Dropzone.js, http://www.dropzonejs.com/
 * https://gist.github.com/compact/8118670#file-dropzone-directive-js
 * Usage:
 * 
 * <div ng-app="app" ng-controller="SomeCtrl">
 *   <button dropzone="dropzoneConfig">
 *     Drag and drop files here or click to upload
 *   </button>
 * </div>
 */


 angular.module('hdtest', [])


 .controller('dzCtrl', ['$scope', function ($scope) {

  
  $scope.dropzoneConfig = {
    'options': { 
      'url': 'http://api.haladrive.local/uploadslides/69'
    },
    'eventHandlers': {
      'sending': function (file, xhr, formData) {

      },
      'success': function (file, response) {
        console.log('file is sent');
      }
    }
  };
}])
.directive('dropzone', [function () {
  return function (scope, element, attrs) {

    element.addClass('dropzone');

    var config, dropzone;

    config = scope[attrs.dropzone];

    // create a Dropzone for the element with the given options
    dropzone = new Dropzone(element[0], config.options);

    // bind the given event handlers
    angular.forEach(config.eventHandlers, function (handler, event) {
      dropzone.on(event, handler);
    });
  };
}]);

