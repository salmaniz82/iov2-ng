angular.module('io2v3').component('quizInfoComponent',  {

            templateUrl: 'views/shared/quizInfo.html',
            controller: function($scope, $http, quizDataService) {

            	var vm  = this;
            	
            	quizDataService.getMasterQuiz(vm.param).then(

	        	function(res) {
	        		vm.Quiz = res.data.quiz[0];
		    		
	        	},


	        	function(res) {

	        		vm.loadProgress = false;
	        		
	        	});
                
            },
            bindings: {
                param: '='
            }
        });