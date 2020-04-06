(function(){
	
    function apiUrl()
    {
      return (location.hostname == 'alpha.iskillmetrics.com') ? 'https://api.iskillmetrics.com/' : 'http://api.io2v3.dvp/';
    }

    function siteUrl()
    {
       return (location.hostname == 'alpha.iskillmetrics.com') ? 'https://alpha.iskillmetrics.com/' : 'http://localhost:8000/';     
    }

    angular.module('io2v3', ['ui.router', 'loadingStatus', 'angularNotify', 'ngSanitize'])
         
     .constant('API_URL', apiUrl())
     .constant('SITE_URL', siteUrl());

})();


angular.module('io2v3').run(['$rootScope','$state', '$stateParams', '$window', 'auth', '$anchorScroll', function ($rootScope, $state, $stateParams, $window, auth, $anchorScroll) {

    $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams, options) {

       // $window.scrollTo(0, 0);



       if($rootScope.pooling != undefined )
       {
         
          $rootScope.pooling.abort(); 

       }


       if($rootScope.studenExamListPooling != undefined)
       {

          $rootScope.studenExamListPooling.abort();
       }


        if(toState.authenticate == true)
        {

            
             
            if(!auth.hastokenAndUser())
            {

                e.preventDefault();
                $state.go('logout');

              /*
                toState, toParams
                these two params can be attached to $rootScope 
                redirect to login 
                login success we can simply redirect user when from which protected route they were redirected to login
                suppose user click at quiz:42 it requires login we can catch these values redirect to login
                when done we can redirect back to that quiz with corresponing ids.
            */

            }



            if(toState.roles != undefined)
            {
                
                
                var userRole = auth.getUser().role;

                if(toState.roles.indexOf(userRole) != -1)
                {
                    
                }
                else {
                    e.preventDefault();
                    $state.go('logout');
                    
                }
            }

            if (toState.permission != undefined)
            {
              
                if(auth.userHasPermission(toState.permission) == false)
                {
                    e.preventDefault();
                    $state.go('logout');
                }
                
              
            }


        }

        

    });


    $rootScope.$on('$stateChangeSuccess', function(e, toState, toParams, fromState, fromParams) {

      $rootScope.pageTitle = $state.current.data.pageTitle;

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

