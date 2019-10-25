  angular.module('io2v3')

    .directive('backButton', [function() {

    return {
        restrict : 'A',
        link : function(scope, ele, attr, ngModel){
            ele.on('click', function(e) {

                history.back();

                e.preventDefault();


            });     
        }
    };


}])