(function() {

    angular.module('io2v3').controller('rolePermissionsCtrl', ['API_URL', '$scope', '$http', function(API_URL, $scope, $http){


        var vm = this;

        $scope.$parent.dash.pageHeading = "Role Permissions";    
        
        vm.pageMode = null;

        vm.ndata = {};


        $http({
        	method: 'GET',
        	url : API_URL+'role-permissions',

        })
        .then(function(res){

        		vm.dataList = res.data;
                vm.pageMode = 'list';

        }, function(res){


        	console.log('failed');

            vm.dataList = res.data;

            vm.pageMode = 'error';

        });



        vm.savePermission = function() 
        {

            var saveUrl = API_URL+'role-permissions';

            $http({

                url : saveUrl,
                method: 'POST',
                data : vm.ndata

            }).then(

            function(res) {

                
                vm.dataList.permissions.push(res.data.lastRecord[0]);

                vm.npermission = {};

                vm.pageMode = 'list';

                var notify = {
                        type: 'success',
                        title: 'Success',
                        content: res.data.message,
                        timeout: 50000 //time in ms
                    };
                    $scope.$emit('notify', notify);



            },
            function(res){

                console.log(res.data);

                var notify = {
                        type: 'error',
                        title: 'Operation Failed',
                        content: res.data.message,
                        timeout: 50000 //time in ms
                    };
                    $scope.$emit('notify', notify);


            });

        };


        vm.statusToggle = function(id, permission_id, role_id, status)
        {

            console.log(role_id);


            var url = API_URL+'role-permissions';


            $http({

                url : url,
                method: 'PUT',
                data: {permission_id: permission_id, role_id: role_id, status: status}

            }).then(statusTogglesuccess, statusToggleerror);


            function statusTogglesuccess(res){


                var notifyType  = (res.data.status == 1) ? 'success' : 'warning';
                var notify = {
                        type: notifyType,
                        title: 'Role Permission',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);
            }

            function statusToggleerror(res)
            {

                var notifyType  = 'error';
                var notify = {
                        type: notifyType,
                        title: 'Role Permission',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);
            }

        };


        vm.remove = function(rolePermissionId, role_id, permission_id)
        {
            console.log('role id ' + role_id);
            console.log('permission id ' + permission_id);


             var idx = $scope.$parent.base.getIndex(vm.dataList.permissions, 'id', rolePermissionId);


             var url = API_URL+'role-permissions/'+rolePermissionId+'/'+role_id+'/'+permission_id;

            $http({

                url : url,
                method: 'delete',
                data: {role_id: role_id, permission_id: permission_id}

            }).then(
            function(res){

                console.log('remove success');               
                vm.dataList.permissions.splice(idx, 1);

            },
            function(res){
                
                console.log('remove error');

            });

        };

        console.log('controller is activated');

    }]);

})();
