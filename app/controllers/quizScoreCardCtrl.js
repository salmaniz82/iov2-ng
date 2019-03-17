(function() {

    angular.module('io2v3').controller('quizScoreCardCtrl', ['API_URL', '$scope', '$http', '$stateParams', function(API_URL, $scope, $http, $stateParams){


        var vm = this;



        vm.examID = $stateParams.examID;
        $scope.$parent.absExamId = vm.examID;

        var attempt_id = $stateParams.attemptID;



        var scoreCardUrl = API_URL+'quiz/scorecard/'+vm.examID+'/'+attempt_id;



        $http.get(scoreCardUrl).then(
        	
        	function(res){

        		vm.dataList = res.data;

        	}, 


        	function(res){

        	});

        


    }]);

})();
