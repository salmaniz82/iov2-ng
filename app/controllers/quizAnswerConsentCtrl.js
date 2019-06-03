(function() {

    angular.module('io2v3').controller('quizAnswerConsentCtrl', ['API_URL', '$scope', '$http', '$stateParams', function(API_URL, $scope, $http, $stateParams){


        var vm = this;


        vm.examID = $stateParams.examID;
        $scope.$parent.absExamId = vm.examID;

        var attempt_id = $stateParams.attemptID;


        var answerUrl = API_URL+'quiz/inspectanswers/'+vm.examID+'/'+attempt_id;

        $scope.$parent.exAbs.pageHeading = "Consent";


        $http.get(answerUrl).then(

        	function(res){
		       	console.log(res);

		       	vm.dataList = res.data;
        	}, 

        	function(res){

        		console.log(res);

        	});

        


    }]);

})();
