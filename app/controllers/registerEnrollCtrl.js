(function() {

    angular.module('io2v3').controller('registerEnrollCtrl', ['API_URL', '$scope', '$http', '$stateParams', function(API_URL, $scope, $http, $stateParams){


        var vm = this;

        vm.examID = $stateParams.examID;
        $scope.$parent.absExamId = vm.examID;

        vm.re = {

        };


        vm.regEnroll = function()
        {


        	vm.re.examID = vm.examID;

        	var regEnrollUrl = API_URL+'register-enroll';

        	function regEnrollSuccess(res)
        	{


                var notify = {
                        type: 'success',
                        title: 'Enrollment Status',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

        	}

	        function regEnrollError(res)
	        {

                var notify = {
                        type: 'error',
                        title: 'Enrollment Error',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

	        }

	        if(vm.re.password == vm.nPass && vm.re.password.length > 5) 
	        {
		        $http({

		        	url : regEnrollUrl,
		        	method: 'POST',
		        	data : vm.re

		        }).then(regEnrollSuccess, regEnrollError);
	        }

	        else {
	        	console.log('both password must match and more then 5 character');
	        }


        }


    }]);

})();
