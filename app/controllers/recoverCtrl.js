(function() {

    angular.module('io2v3').controller('recoverCtrl', ['API_URL', '$scope', '$http', '$stateParams', '$state', function(API_URL, $scope, $http, $stateParams, $state){


        var vm = this;


        vm.encodedToken = null;

        vm.localvertication = false;


        if($stateParams.accesstoken == undefined)
        {
           $state.go('ua.login');
        }

        else {

            vm.encodedToken = $scope.$parent.base.decodeUrlToken($stateParams.accesstoken);

            if(typeof(vm.encodedToken) !== 'object')
            {

               $state.go('ua.login'); 

            }
         
            if(vm.encodedToken.action != 'updatepswonforget')
            {
               $state.go('ua.login');  
              
            }
         
        }


        console.log(vm.encodedToken);


        vm.validateEmail = function()
        {

            if(vm.email != vm.encodedToken.email)
            {
              
                $state.go('ua.login');

            }

            else {

                vm.localvertication = true;

            }

        };


        vm.attemptUpdatePassword = function()
        {

            var successValidation  = function(res)
            {

              var notify = {
                        type: 'success',
                        title: 'Operation Successful',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                    $state.go('ua.login');


            };

            var errorValidation  = function(res)
            {

              var notify = {
                        type: 'error',
                        title: 'Operation Failed',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

            };

            vm.dataPayload = {'email' : vm.email, 'password': vm.password};

            $http({

                url : API_URL+'residue/doaction/'+vm.encodedToken.id,
                method: 'PUT',
                data : vm.dataPayload,
                headers : {'accesstoken': $stateParams.accesstoken}

            }).then(successValidation, errorValidation);


        };



    }]);

})();
