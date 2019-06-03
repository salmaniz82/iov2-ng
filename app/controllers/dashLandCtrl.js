(function() {

    angular.module('io2v3').controller('dashLandCtrl', ['API_URL', '$scope', '$http', '$state', 'auth', function(API_URL, $scope, $http, $state, auth){


        var vm = this;


       //  $state.go('dash.admindashboard');

       $scope.$parent.base.pageUrl = $state.current.url; 


       $scope.$parent.dash.pageHeading = "Main";

       if(auth.isLoggedIn())
       {

			var UserRole = auth.getUser().role;     		

			console.log(UserRole);				

       		if(UserRole == 'admin')
       		{
				    $state.go('dash.admindashboard');
       		}

       		else if (UserRole == 'entity')
       		{
       			$state.go('dash.entityDashbaord');		
       		}

       		else if (UserRole == 'contributor')
       		{
       			// create a dashbaord for contributor

            $state.go('dash.contributorDashbaord');

       		}

       		else if (UserRole == 'content developer')
       		{
       			// create a dashboard for content developer

            $state.go('dash.contDevDashbaord');
       		}

          else if (UserRole == 'students' || UserRole == 'candidate')
          {
            
              $state.go('std.studentDashbaord');

          }

       		else {

       			// if there no role specified then route to the logout

       		}

       }


       $scope.$parent.base.pageUrl = $state.current.url; 


        vm.loadingStatus = null;
  		

    }]);

})();
