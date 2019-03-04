(function(){
	angular.module('io2v3')
	.controller('authAppCtrl', function($state, auth, $scope, API_URL, $http){

		vm = this;

		vm.auMessage = "This message is delivered from authAppCtrl"; 
		
       
		

		var allowedRoles = [1,3];
		var roleID = auth.getUser().role_id;
		roleID = parseInt(roleID);

		if( ( auth.isLoggedIn() ) && ( roleID !== 1 && roleID !== 3) )
		{
			$state.go('app.logout');
		}

       
	});

})();