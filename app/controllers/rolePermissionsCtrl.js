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

        


        console.log('controller is activated');




    }]);

})();
