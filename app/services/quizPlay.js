angular.module('io2v3')
	.service('quizPlay', ['$http', 'API_URL', function($http, API_URL) {

		this.prepQuizQuestion = function(quiz_id, attempt_id)
		{
			
			var quizPlayUrl = API_URL+'std-quiz-play/quiz_id/'+quiz_id+'/attempt_id/'+attempt_id;
			return $http.get(quizPlayUrl);

		};


		this.dlsPrep = function(quiz_id, attempt_id)
		{

			var dlsQuizUrl = API_URL+'std-quiz-play/dls/'+quiz_id+'/attempt_id/'+attempt_id;
			return $http.get(dlsQuizUrl);

		};


		this.demoQuizData = function()
		{

			var demoQuizUrlRoute = API_URL+'demoquizplay'
			return $http.get(demoQuizUrlRoute);

		};	

		
	}]);