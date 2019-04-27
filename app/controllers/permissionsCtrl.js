(function() {

    angular.module('io2v3').controller('permissionsCtrl', ['API_URL', '$scope', '$http', function(API_URL, $scope, $http){


        var vm = this;


        
        vm.pageMode = null;


        $http({
        	method: 'GET',
        	url : API_URL+'permissions',

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

        


        console.log('controller is activated');




    }]);

})();
