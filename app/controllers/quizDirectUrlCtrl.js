(function() {

    angular.module('io2v3').controller('quizDirectUrlCtrl', ['API_URL', '$scope', '$http', '$stateParams', 'SITE_URL', function(API_URL, $scope, $http, $stateParams, SITE_URL){


        var vm = this;


        
        vm.examID = $stateParams.examID;
        $scope.$parent.absExamId = $stateParams.examID;


        $scope.$parent.exAbs.pageHeading = "Direct Url";


        vm.loadProgress = null;

        vm.hasdirectUrl = false;


        console.log('quizDirectUrlCtrl activated');



        $http.get(API_URL+'quiz-alphaid/'+vm.examID).then(

        	function(res){

                
        		if(res.data.alphaID != undefined)
        		{

        		
                    var alphaID = res.data.alphaID;    	
        			vm.hasdirectUrl = true
		       		vm.quizDirectUrl = SITE_URL+"d/"+alphaID;
		       		console.log('yes it has a token');
        			
        		}
                
        		

        	}, 

        	function(res){



        	})

        


    }]);

})();
