(function(){
    angular.module('io2v3')

    .directive('pickDt', function() {

        return {

            restrict: 'C',
            link: function(scope, ele, attr, ngModel)
            {
                ele.datetimepicker({
                format: 'yyyy-MM-dd hh:mm',
                pickDate: true,
                pickTime: true,
                pick12HourFormat: false,   /* enables the 12-hour format time picker*/
                pickSeconds: false,
                language: 'en',
                change : function(e) {

                    console.log('dp check in');


                }

                });
            }

        };





    });

})();



