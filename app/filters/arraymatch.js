angular.module('io2v3').filter('contains', function() {
  return function (array, needle) {
    return array.indexOf(needle) >= 0;
  };
});

