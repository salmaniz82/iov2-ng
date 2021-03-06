(function() {

    angular.module('io2v3').controller('usersCtrl', ['API_URL', '$scope', '$http', '$state', 'auth', function(API_URL, $scope, $http, $state, auth){


        var vm = this;


        $scope.sortType = '$';
        vm.searchQuery = '';
        $scope.sortReverse  = false;


        vm.roleLabel = function(role)
        {

            if(role == 'students')
            {
                return 'Candidate';
            }
            else if(role == 'contributor')
            {
                return 'Test Developer';
            }

            else {
                return role;
            }

        };



        vm.selectSortfield = function(fieldName)
        {

            $scope.sortType = fieldName;

        };


        vm.clearFilters = function()
        {

            $scope.sortType = '$';
            vm.searchQuery = '';
            $scope.sortReverse  = false;

        };




        $scope.$parent.base.pageUrl = $state.current.url; 

        $scope.$parent.dash.pageHeading = "Users";


        vm.loadingStatus = null;


        vm.forceCategoryBound = false;


        vm.modalOpen = false;

        vm.modalData;

        vm.permssionModal = false;


        vm.deleteConfirmModal = false;

        vm.xUSer = null;

        vm.nUser = {};


        vm.addUser = false;


        vm.userRole = auth.getUser()['role'];


        vm.changePassword = false;




        vm.userBindCheck = function()
        {

            console.log();


            var idx = $scope.$parent.base.getIndex(vm.roles, 'id', vm.nUser.role_id);

            var chosenRole = vm.roles[idx]['role'];


            if(chosenRole == 'contributor' || chosenRole == 'content developer')
            {

                vm.forceCategoryBound = true;

            }

            else {
                vm.forceCategoryBound = false;
                
            }





        }


        vm.generateFromRandom = function()
        {

           vm.generatedPassword = $scope.$parent.base.generatePassword();
           vm.nUser.password =  vm.generatedPassword;
           vm.nUser.passwordConfirm =  vm.generatedPassword;

        };


        vm.activateAddUser = function()
        {

            vm.generatedPassword = "";
            vm.nUser = "";
            vm.addUser = true;

        };

        vm.deactivateAddUser = function()
        {

            vm.generatedPassword = "";
            vm.nUser = "";
            vm.addUser = false;            

        };





        vm.addNewUser = function()
        {


            var url = API_URL+'users';

                $http({

                    url : url,
                    method: 'POST',
                    data : vm.nUser

                }).then(registerSuccess, registerError);


                function registerSuccess(res)
                {


                    var notify = {
                        type: 'success',
                        title: 'Operation Successfull',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                    vm.addUser = false;
                    vm.nUser = {};

                    if(vm.dataList != undefined)
                    {
                        
                        vm.dataList.push(res.data.lastCreatedUser[0]);

                        console.log('with existing list');


                    }

                    else {

                        console.log('on empty user list');

                        vm.dataList = res.data.lastCreatedUser;

                        vm.loadingStatus = true;

                    }

                    


                }

                function registerError(res)
                {


                        var notify = {
                        type: 'error',
                        title: 'User Creations Failed',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                }

            
        };





        vm.launchDeleteConfirmation = function(itemId)
        {

            vm.deleteConfirmModal = true;
            var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', itemId);
            vm.xUSer = vm.dataList[idx];

        };

        vm.closeDeleteModal = function()
        {

            vm.deleteConfirmModal = false;
            vm.xUSer = null;

        }


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


                        if(res.data.customPermissionList == false)
                        {
                            vm.newCustomPermission = false;
                        }
                        else {

                            vm.newCustomPermission = true;

                            vm.customPermissionList = res.data.customPermissionList;

                        }                     

                        console.log(res.data);


                }, function(res){

                    var notify = {
                        type: 'error',
                        title: 'User Permissions',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);


                });

        };






        vm.launchModal = function(user_id)
		{
			
			var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', user_id);
			vm.modalData = vm.dataList[idx];
			vm.modalOpen = true;
			console.log(vm.modalData);

		};

        vm.cpGenerateFromRandom = function()
        {
            vm.cpGenerated = $scope.$parent.base.generatePassword();
            vm.modalData.password =  vm.cpGenerated;
            vm.modalData.cpassword =  vm.cpGenerated;

        };



        vm.deactivateChangePassword = function()
        {

            vm.modalOpen = false;
            vm.modalData.password = "";
            vm.modalData.cpassword = "";
            vm.modalData = null;

            vm.cpGenerated = false;

        };


        vm.udpatePassword = function()
        {


            var url = API_URL+'changepassword/'+vm.modalData.id;

            var updatePayload = {
                'password': vm.modalData.password
            };

            function successPasswordChange(res)
            {

                
                var notify = {
                        type: 'success',
                        title: 'Operation Successfull',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);


                    vm.deactivateChangePassword();

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
            cache: false
        })
        .then(function(res){

            vm.topCategories = res.data.topCategories;
            vm.roles = res.data.roles;

        	if(res.status == 200)
        	{
        		vm.dataList = res.data.users;

                
                
                vm.loadingStatus = true;
        	}
            else if (res.status == 206)
            {
                vm.loadingStatus = 'no contents';

                
            }

            

        }, function(res){

        	vm.loadingStatus = false;

        });

        

        
        vm.statustoggle = function(user_id, userStatus)
        {

        	var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', user_id);


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
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);


                    vm.dataList[idx].status = (userStatus == 1) ? '0' : '1';



	        	

	        });

        };



        vm.resetUserPermissions = function(user_id, role_id)
        {

            var url = API_URL+'users-permissons/reset/'+user_id+'/'+role_id;


            $http({

                url : url,
                method: 'PUT',
                data : {}


            }).then(

            function(res){

                var notify = {
                            type: 'success',
                            title: 'User Permissions',
                            content: res.data.message,
                            timeout: 3000 //time in ms
                        };
                         $scope.$emit('notify', notify);

            }, 

            function(res){


                var notify = {
                        type: 'error',
                        title: 'User Permission',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);



            });


        };



        vm.addNewUserPermission = function(user_id)
        {

            


            if(isNaN(vm.nctp))
            {
                
                var notify = {
                        type: 'error',
                        title: 'Validation',
                        content: 'Missing Permission ID',
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                return false;

            }


            var url = API_URL+'user-permissions';


            $http({

                url : url,
                method: 'POST',
                data: {user_id : user_id, permission_id : vm.nctp}

            }).then(
            
            function(res){

                var notify = {
                        type: 'success',
                        title: 'User Permissions',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);
                    
                    vm.userPermissions.push(res.data.lastAdded[0]);


            }, 

            function(res){


                var notify = {
                        type: 'error',
                        title: 'User Permissions',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

            });

        };



        vm.privatePermissionToggle = function(permissionID, user_id, pStatus)
        {

            var url = API_URL+'users-permissons/status-toggle/'+user_id+'/'+permissionID;

            $http({

                url : url,
                method : 'PUT',
                data : {pStatus: pStatus}

            }).then(

            function(res){


                var notifyType = (res.data.permissionStatus == 0) ? 'warning' : 'success';


                var notify = {
                            type: notifyType,
                            title: 'User Permissions',
                            content: res.data.message,
                            timeout: 3000 //time in ms
                        };
                         $scope.$emit('notify', notify);



            }, 
            function(res){


                var notify = {
                        type: 'error',
                        title: 'User Permission',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

            });


        };


        vm.deleteUser = function(itemId)
        {


            $http({

                url : API_URL+'users/'+itemId,
                method: 'DELETE',
                data : {}
            }).then(

            function(res){

                /*
                    
                    remove from the list


                */

                var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', itemId);


                vm.dataList[idx].proceedToX = false;

                vm.deleteConfirmModal = false;

                vm.xUSer.proceedToX = false;



                vm.dataList.splice(idx, 1);

                var notify = {
                            type: 'warning',
                            title: 'OPeration Successfull',
                            content: res.data.message,
                            timeout: 3000 //time in ms
                        };
                         $scope.$emit('notify', notify);


            }, 

            function(res){

                var notify = {
                            type: 'error',
                            title: 'OPeration Failed',
                            content: res.data.message,
                            timeout: 3000 //time in ms
                        };
                         $scope.$emit('notify', notify);


            });


        };


    }]);

})();
