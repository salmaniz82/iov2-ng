(function() {

    angular.module('io2v3').controller('rolePermissionsCtrl', ['API_URL', '$scope', '$http', function(API_URL, $scope, $http){


        var vm = this;


        
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


        vm.edit = function(rolePermissionId, role_id, permission_id)
        {



        };


        vm.remove = function(rolePermissionId, role_id, permission_id)
        {
            console.log('role id ' + role_id);
            console.log('permission id ' + permission_id);

             var url = API_URL+'role-permissions/'+rolePermissionId+'/'+role_id+'/'+permission_id;

            $http({

                url : url,
                method: 'delete',
                data: {role_id: role_id, permission_id: permission_id}

            }).then(
            function(res){

                console.log('remove success');

            },
            function(res){

                console.log('remove error');

            });

        };


        console.log('controller is activated');




    }]);

})();
