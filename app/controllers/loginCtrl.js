(function(){
	angular.module('io2v3')

	.controller('loginCtrl',['$state', 'auth', 'API_URL', '$scope', '$stateParams', function ($state, auth, API_URL, $scope, $stateParams){

		auth.clearAllhttpCache();

		var vm = this;

		vm.loginStatus = null;
		vm.wrongCreds = null;

		vm.actionTokenObj = null;

		vm.interceptDefaultRedirect = false;



		if($stateParams.actiontoken != undefined)
		{

		
			var decodedUriObj = $scope.$parent.base.decodeUrlToken($stateParams.actiontoken);


			if(typeof(decodedUriObj) == "object")
			{
				vm.actionTokenObj = decodedUriObj;	
				vm.interceptDefaultRedirect = true;

				console.log(vm.actionTokenObj);
			}


		}



		vm.handleRedirect = function()
		{


			if(auth.isLoggedIn() && auth.getUser().role != 'admin')
			{

				/*
				auth.secureProtectUI();			
				*/

			}


			if(!localStorage.getItem('auth_token'))
			{			
				return false;
			}



			if(!vm.interceptDefaultRedirect)
			{
				$state.go('dash.land');
				console.log('default no intercept from login redirect');
			}

			else if(vm.actionTokenObj.action == 'quizInvitation') {

				$state.go('inv.invited', {'entityslug': vm.actionTokenObj.entitySlug, 'invitetoken': $stateParams.actiontoken});
			}

			else if(vm.actionTokenObj.action == 'directQuiz')
			{

				console.log('navigate to direct quiz');

				$state.go('inv.invited', {'entityslug': vm.actionTokenObj.entitySlug, 'invitetoken': $stateParams.actiontoken});

			}

			else {

				$state.go('dash.land');

			}


		};




		vm.handleRedirect();

		
		vm.login = function() 
		{		
			 var promise  = auth.login(vm.creds);
			 promise.then(success, error);

		};


		var success = function(response){
			

			vm.loginStatus = true;
			vm.wrongCreds = false;

			


			

            var auth_token = null;

			if(response.data.token != undefined)
			{
				auth_token = response.data.token;
                localStorage.setItem('auth_token', auth_token);
                var user = response.data.user;

                var hdAuthUser = JSON.stringify(user);

                // btoa() encode
                // atob() decode

                hdAuthUser = btoa(hdAuthUser);
                localStorage.setItem('hdauEn', hdAuthUser);

			
				auth.getUser();

				vm.handleRedirect();


			}

			var AuthUser = auth.getUser();
			

		};
		var error = function(response){

			

			vm.loginStatus = false;
			vm.wrongCreds = true;

			 var notify = {
                        type: 'error',
                        title: 'Error Heading',
                        content: response.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);
		};

	}]);



})();