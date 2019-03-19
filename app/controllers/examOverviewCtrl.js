(function() {

    angular.module('io2v3').controller('examOverviewCtrl', ['API_URL', '$scope', '$http', '$stateParams', 'quizDataService', function(API_URL, $scope, $http, $stateParams, quizDataService){


        var vm = this;

        vm.examID = $stateParams.examID;
        $scope.$parent.absExamId = $stateParams.examID;


        vm.loadProgress = null;


        quizDataService.getMasterQuiz(vm.examID).then(

	    	function(res){

	    		console.log(res);

	    		vm.Quiz = res.data.quiz[0];
	    		vm.Distro = res.data.quizBaseDistro;


	    	}, 

	    	function(res){

	    		console.log(res);
  	    		vm.loadProgress = false;

	        });

		
        

    }]);

})();
