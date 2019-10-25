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

                    
                  
                } else {
                  
                    elem.remove();


                    

                }
              });          
       }
   }


}