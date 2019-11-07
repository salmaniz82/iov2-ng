(function() {

    angular.module('io2v3').controller('forgetCtrl', ['API_URL', '$scope', '$http', '$stateParams', '$state', function(API_URL, $scope, $http, $stateParams, $state){


        var vm = this;


        console.log('forget ctrl is actvitated');



        vm.sendRecover = function()
        {

        	var recoverSuccess = function(res){


                var notify = {
                        type: 'info',
                        title: 'Successful',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);



        	};
        	var recoverError = function(res){


                var notify = {
                        type: 'error',
                        title: 'Operation Failed',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

        	};


        	$http({

        		url : API_URL+'residue',
        		method : 'POST',
        		data : {'email' : vm.email}

        	}).then(recoverSuccess, recoverError);


        };

       

    }]);

})();
