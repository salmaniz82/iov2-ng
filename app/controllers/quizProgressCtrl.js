(function() {

    angular.module('io2v3').controller('quizProgressCtrl', ['API_URL', '$scope', '$http', '$stateParams', function(API_URL, $scope, $http, $stateParams){


        var vm = this;
        vm.examID = $stateParams.examID;
        $scope.$parent.absExamId = vm.examID;
        vm.loadStatus = null;


        vm.dataList = null;

        var progressUrl = API_URL+'quiz/progress/'+vm.examID;

        $http.get(progressUrl).then(

        	function(res){
                
        		vm.loadStatus = true;
                vm.dataList = res.data;

        	}, 

        	function(res){

        		vm.loadStatus = false;      		

        	});



    }]);

})();
