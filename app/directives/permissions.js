/*
angular.module('io2v3')   
.directive('permissions', function(auth) {
   return {
       restrict: 'A',
       scope: {
          permission: '='
       },
 
       link: function (scope, elem, attrs) {

            scope.$watch(auth.isLoggedIn, function() {
                if (auth.userHasPermission(scope.permission)) {                 
                    elem.show();

                    console.log('found permission');
                } else {

                  console.log('permission not found');
                    elem.hide();


                }
            });                
       }
   }
});

*/

/*

angular.module('io2v3')   
.directive('permissions', permissionDirective);
permissionDirective.$inject = ['auth'];
function permissionDirective(auth)
{
  return {
       restrict: 'A',
       scope: {
          permission: '='
       },
 
       link: function (scope, elem, attrs) {

            scope.$watch(auth.isLoggedIn, function() {
                if (auth.userHasPermission(scope.permission)) {                 
                    elem.show();

                    console.log('found permission');
                } else {
                  console.log('permission not found');
                    elem.hide();

                }
            });                
       }
   }


}
*/



angular.module('io2v3').directive('permissions', permissionDirective);
permissionDirective.$inject = ['auth'];


function permissionDirective(auth)
{
  return {
       restrict: 'A',
       scope: {
          permissions: '='
       },
 
       link: function (scope, elem, attrs) {

         
            scope.$watch(auth.isLoggedIn(), function() {
                if (auth.userHasPermission(scope.permissions)) {

                     elem.show();

                     console.log('has permission');
                  
                } else {
                  
                    elem.hide();


                    console.log('no permission');

                }
              });          
       }
   }


}