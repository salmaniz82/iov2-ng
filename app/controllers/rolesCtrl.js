(function() {

    angular.module('io2v3').controller('rolesCtrl', ['API_URL', '$scope', '$http', function(API_URL, $scope, $http){


        var vm = this;


        $http({
        	method: 'GET',
        	url : API_URL+'roles',
        })
        .then(function(res){

        		vm.dataList = res.data;

        }, function(res){


        	console.log('failed');

        });




    }]);

})();
