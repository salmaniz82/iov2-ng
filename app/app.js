(function(){
	
    function apiUrl()
    {
      return (location.hostname == 'alpha.iskillmetrics.com') ? 'https://api.iskillmetrics.com/' : 'http://api.io2v3.dvp/';
    }

    angular.module('io2v3', ['ui.router', 'loadingStatus', 'angularNotify', 'ngSanitize'])
    
     .constant("API_URL", apiUrl());

})();


angular.module('io2v3').run(['$rootScope','$state', '$stateParams', '$window', 'auth', '$anchorScroll', function ($rootScope, $state, $stateParams, $window, auth, $anchorScroll) {

    $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams, options) {


        

       // $window.scrollTo(0, 0);


        if(toState.authenticate == true)
        {

            console.log('route is asking for authentication');
             
            if(!auth.hastokenAndUser())
            {

                e.preventDefault();
                console.log('require auth redirecting to login');
                $state.go('ua.login');

              /*
                toState, toParams
                these two params can be attached to $rootScope 
                redirect to login
                login success we can simply redirect user when from which protected route they were redirected to login
                suppose user click at quiz:42 it requires login we can catch these values redirect to login
                when done we can redirect back to that quiz with corresponing ids.
            */

            }



            else if(toState.roles != undefined)
            {
                
                
                var userRole = auth.getUser().role;

                console.log(userRole);

                if(toState.roles.indexOf(userRole) != -1)
                {
                    console.log('Role Matched and can view the route');
                }
                else {
                    e.preventDefault();
                    $state.go('pub.home');
                    console.log('this role is not allowed to touch this route');                   
                }

            }

        }

        

    });


    $rootScope.$on('$stateChangeSuccess', function(e, toState, toParams, fromState, fromParams) {

        


                
          /*  

        setTimeout(function() {

         //   $window.scrollTo(0, 0);

            console.log('page has finised loading');

        }, 3000);

        */



        

        // only when need to intercept
       // e.preventDefault();

    });

    $rootScope.$on('$stateChangeError', function(e, toState, toParams, fromState, fromParams, error) {

        console.log(error);

    });


}]);

