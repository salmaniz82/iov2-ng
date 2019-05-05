(function() {

    angular.module('io2v3').controller('registerCtrl', ['API_URL', '$scope', '$http', '$state', function(API_URL, $scope, $http, $state){


        
        var vm = this;


        vm.nuser = {};


        vm.register = function()
        {

        	console.log(vm.nuser);

        	var error = 0;


			if(vm.nuser.password != vm.nuser.cpassword)
			{
				
				

				var notify = {
                        type: 'error',
                        title: 'Error',
                        content: 'Both Password Must be the Same',
                        timeout: 3000 //time in ms
                    };

                    $scope.$emit('notify', notify);

			}

            else if (error == 0)
            {


                function registerSuccess(res)
                {
                    

                    var notify = {
                        type: 'success',
                        title: 'Registration Successfull',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };

                    $scope.$emit('notify', notify);

                    $state.go('ua.login');



                }

                function registerError(res)
                {
                    

                    var notify = {
                        type: 'error',
                        title: 'Error',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };

                    $scope.$emit('notify', notify);

                }

                var url = API_URL+'users';

                $http({

                    url : url,
                    method: 'POST',
                    data : vm.nuser

                }).then(registerSuccess, registerError);

            }

            else {
                console.log('state undefined action');
            }


        };


    }]);

})();
