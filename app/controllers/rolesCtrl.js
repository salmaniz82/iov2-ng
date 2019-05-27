(function() {

    angular.module('io2v3').controller('rolesCtrl', ['API_URL', '$scope', '$http', '$state', function(API_URL, $scope, $http, $state){


        var vm = this;

        $scope.$parent.base.pageUrl = $state.current.url; 


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
