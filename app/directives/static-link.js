(function(){
    
    angular.module('io2v3')

    .directive('staticLink', [function() {

    vm = this;

    return {
        restrict : 'C',
        link : function(scope, ele, attr, ngModel){
            ele.on('click', function(e) {
            e.preventDefault();
            });     
        }
    };


}])
    .directive('dropdownButton', [function() {


        vm = this;

    return {
        restrict : 'C',
        link : function(scope, ele, attr, ngModel){
        ele.on('click', function(e) {
        e.preventDefault();
        });
        }
    };
}]);



    .directive('ngEnter', [function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
}]);



})();



