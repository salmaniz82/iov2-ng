(function() {

    angular.module('io2v3').controller('catTreeCtrl', ['API_URL', '$scope', '$http', '$state', function(API_URL, $scope, $http, $state){


        var vm = this;

        $scope.$parent.base.pageUrl = $state.current.url; 


        var treeUrl = API_URL+'cat-tree';

        $http.get(treeUrl).then(function(res){

        	vm.dataList = res.data.tree;

        });


    }]);

})();
