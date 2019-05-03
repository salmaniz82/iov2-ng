
    angular.module('io2v3')

    .directive('pickDt', function() {

        return {

            restrict: 'C',
            require: 'ngModel',

            link: function(scope, ele, attr, ngModel)
            {
                ele.datetimepicker({
                format: 'yyyy-MM-dd hh:mm',
                pickDate: true,
                pickTime: true,
                pick12HourFormat: false,   
                pickSeconds: false,
                language: 'en',

                    onSelect: function(dateText) {
                      scope.$apply(function() {
                        ngModel.$setViewValue(dateText);
                    });
                 }
                

                });
            }

        };

    });




/*

angular.module('io2v3').directive('pickDt', function() {
  return {
    restrict: 'C',
    require: 'ngModel',

    link: function(scope, el, attr, ngModel) {
      el.datetimepicker({
        onSelect: function(dateText) {
          scope.$apply(function() {
            ngModel.$setViewValue(dateText);
          });
        }
      });
    }
  };
});
*/








