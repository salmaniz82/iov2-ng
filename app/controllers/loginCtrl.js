(function(){
	angular.module('io2v3')

	.controller('loginCtrl', function ($state, auth, API_URL, $scope){


		
		var vm = this;

		vm.loginStatus = null;
		vm.wrongCreds = null;


		if(localStorage.getItem('auth_token'))
		{			
			$state.go('dash.land');
		}

		
		vm.login = function() 
		{		
			 var promise  = auth.login(vm.creds);
			 promise.then(success, error);

		};


		var success = function(response){
			console.log('success ran');

			vm.loginStatus = true;
			vm.wrongCreds = false;

			// console.log(response.data.token[0].token);

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

				$state.go('dash.land');

			}

			var AuthUser = auth.getUser();


			
			

		};
		var error = function(response){
			console.log('error ran');

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

	});



})();