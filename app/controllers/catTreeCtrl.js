(function() {

    angular.module('io2v3').controller('catTreeCtrl', ['API_URL', '$scope', '$http', function(API_URL, $scope, $http){


        var vm = this;


        var treeUrl = API_URL+'cat-tree';

        $http.get(treeUrl).then(function(res){

        	vm.dataList = res.data.tree;

        });


    }]);

})();
