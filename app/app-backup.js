(function(){
	
    function apiUrl()
    {
      return (location.hostname == 'app.haladrive.com') ? 'https://api.haladrive.com' : 'http://api.io2v3.dvp/';
    }

    angular.module('io2v3', ['ui.router', 'loadingStatus', 'angularNotify'])
       .constant("API_URL", apiUrl());
})();



$(document).ready(function() {

    $('select').material_select();

});


/*
$(document).on('load', '.modal', function() {
    $('.modal').modal();
});

$(document).on('click', "a[href='#modal1']", function(e) {
    $('#modal1').modal();
    e.preventDefault();
    console.log('got the click');
});

    */


angular.module('io2v3').run(['$rootScope','$state', '$window', 'auth', function ($rootScope, $state, $window, auth) {

    $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams, options) {




        if(toState.authenticate)
        {
             
            if(!auth.hastokenAndUser())
            {

                e.preventDefault();
                $state.go('app.login');

              /*
                toState, toParams
                these two params can be attached to $rootScope 
                redirect to login
                login success we can simply redirect user when from which protected route they were redirected to login
                suppose user click at quiz:42 it requires login we can catch these values redirect to login
                when done we can redirect back to that quiz with corresponing ids.
            */

           

            console.log(toState.roles);

            }



            else if(toState.roles != undefined)
            {
                var userRole = auth.getUser().role;
                if(toState.roles.indexOf(userRole) != -1)
                {
                    console.log('Role Matched and can view the route');
                }
                else {
                    e.preventDefault();


                    $state.go('app.logout');

                    console.log('this role is not allowed to touch this route');

                    
                }

            }

            console.log('This route is protected and user must needs to be thrown out of the application');

            // second layer check the allowed roles 

            

        }

    });


    $rootScope.$on('$stateChangeSuccess', function(e, toState, toParams, fromState, fromParams) {

    });

    $rootScope.$on('$stateChangeError', function(e, toState, toParams, fromState, fromParams, error) {

        if(error == 'Not Authorized')
        {
        
       //   $state.go('app.logout');
        
        }

      e.preventDefault();

    });


}]);

