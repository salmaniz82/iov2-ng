(function() {

    angular.module('io2v3').controller('permissionsCtrl', ['API_URL', '$scope', '$http', '$state', function(API_URL, $scope, $http, $state){


        var vm = this;

        $scope.$parent.base.pageUrl = $state.current.url; 


        $scope.$parent.dash.pageHeading = "Permissions";


        
        vm.pageMode = null;


        $http({
        	method: 'GET',
        	url : API_URL+'permissions',
            cache: false

        })
        .then(function(res){

        		vm.dataList = res.data;
                vm.pageMode = 'list';

        }, function(res){


        	console.log('failed');

            vm.pageMode = 'error';

        });



        vm.savePermission = function() 
        {

            var saveUrl = API_URL+'permissions';

            vm.npermission.name = $scope.$parent.base.slugify(vm.npermission.name);


            $http({

                url : saveUrl,
                method: 'POST',
                data : vm.npermission

            }).then(

            function(res) {

                console.log(res.data);
                vm.dataList.permissions.push(res.data.permission[0]);

                vm.npermission = {};

                vm.pageMode = 'list';

                var notify = {
                        type: 'success',
                        title: 'Success',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);


            },
            function(res){

                console.log(res.data);

                var notify = {
                        type: 'error',
                        title: 'Operation Failed',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);


            });

        };



        vm.removePermission = function(itemId)
        {

            


            var idx = $scope.$parent.base.getIndex(vm.dataList.permissions, 'id', itemId);


            console.log(idx);

            function deleteSuccess(res)
            {

                var notify = {
                                type: 'success',
                                title: 'Delete Permission',
                                content: res.data.message,
                                timeout: 5000 //time in ms
                            };
                            $scope.$emit('notify', notify);  

                            vm.dataList.permissions.splice(idx, 1);  
            }

            function deleteError(res)
            {


                  var notify = {
                                type: 'error',
                                title: 'Delete Permission',
                                content: res.data.message,
                                timeout: 5000 //time in ms
                            };
                            $scope.$emit('notify', notify);    


            }


            $http.delete(API_URL+'permissions/'+itemId).then(deleteSuccess, deleteError);





        };

        


        console.log('controller is activated');




    }]);

})();
