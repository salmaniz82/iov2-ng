(function() {

    angular.module('io2v3').controller('rolesCtrl', ['API_URL', '$scope', '$http', '$state', function(API_URL, $scope, $http, $state){


        var vm = this;

        $scope.$parent.base.pageUrl = $state.current.url; 

        $scope.$parent.dash.pageHeading = "Roles";


        vm.loading = null;


        $http({
        	method: 'GET',
        	url : API_URL+'roles',
            cache: false
        })
        .then(function(res){

        		vm.dataList = res.data;

                vm.loading = true;

        }, function(res){



            vm.loading = true;

        	

        });



        vm.resetDefaultPermissions = function(itemId)
        {


            $http({

                url : API_URL+'roles-reset-permission/'+itemId,
                method : 'PUT',
                data : {}


            }).then(

            function(res){

            }, 

            function(res){

            })

        };




    }]);

})();
