(function() {

    angular.module('io2v3').controller('examOverviewCtrl', ['API_URL', '$scope', '$http', '$stateParams', function(API_URL, $scope, $http, $stateParams){


        var vm = this;

        vm.examID = $stateParams.examID;
        $scope.$parent.absExamId = $stateParams.examID;




        


        var distroUrl = API_URL+'quiz/subjects/'+vm.examID;



        $http.get(distroUrl).then(
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
