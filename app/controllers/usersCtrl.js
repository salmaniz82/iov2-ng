(function() {

    angular.module('io2v3').controller('usersCtrl', ['API_URL', '$scope', '$http', function(API_URL, $scope, $http){


        var vm = this;


        vm.modalOpen = false;

        vm.modalData;


        vm.permssionModal = false;


        vm.loadPermissions = function(itemId)
        {

            
            var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', itemId);
            vm.modalData = vm.dataList[idx];


                $http({
                    method: 'GET',
                    url : API_URL+'user-permissions/'+itemId,

                })
                .then(function(res){
                        vm.userPermissions = res.data.userPermissions;
                        vm.permssionModal = true;                       

                        console.log(res.data);


                }, function(res){

                    console.log('failed');
                });

        };






        vm.launchModal = function(user_id)
		{
			
			var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', user_id);
			vm.modalData = vm.dataList[idx];
			vm.modalOpen = true;
			console.log(vm.modalData);

		};


        vm.udpatePassword = function()
        {


            var url = API_URL+'changepassword/'+vm.modalData.id;

            var updatePayload = {
                'password': vm.modalData.password
            };

            function successPasswordChange(res)
            {

                vm.modalOpen = false;

                vm.modalData = {};
                
                var notify = {
                        type: 'success',
                        title: 'Operation Successfull',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

            }

            function errorPasswordChange(res)
            {
                console.log('failed while updating password');
            }



            if(vm.modalData.password == vm.modalData.cpassword)
            {

                $http({
                url : url,
                method : 'PUT',
                data: updatePayload
            }).then(successPasswordChange, errorPasswordChange);



            }

            else {


                var notify = {
                        type: 'error',
                        title: 'Validation Error',
                        content: 'Both Password must be same',
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);


                
            }


        };




        


        $http({
        	method: 'GET',
        	url : API_URL+'users',
        })
        .then(function(res){

        	if(res.data.status == true)
        	{
        		vm.dataList = res.data.users;
        	}



        }, function(res){


        	console.log('failed');

        });

        

        
        vm.statustoggle = function(user_id, userStatus)
        {

        	var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', user_id);
        	user_id;

        	$http({
        		method: 'PUT',
        		url : API_URL+'users/status-toggle/'+user_id,
        		data : {'status': userStatus}
        	})

        	.then(function(res){


                if(res.data.user[0].status == 1)
                {

    	        	var notify = {
                            type: 'success',
                            title: 'Operation Successfull',
                            content: res.data.message,
                            timeout: 3000 //time in ms
                        };
                         $scope.$emit('notify', notify);
                }

                else {

                    var notify = {
                            type: 'warning',
                            title: 'Operation Successfull',
                            content: res.data.message,
                            timeout: 3000 //time in ms
                        };
                         $scope.$emit('notify', notify);

                }


	        }, function(res){

	        	var notify = {
                        type: 'error',
                        title: 'Operation Failed',
                        content: 'Unable to udpate user at this moment',
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

	        	

	        });

        };









    }]);

})();
