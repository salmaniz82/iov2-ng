angular.module('io2v3')
	.service('quizPlay', function($http, API_URL) {

		this.prepQuizQuestion = function(quiz_id, attempt_id)
		{
			
			var quizPlayUrl = API_URL+'std-quiz-play/quiz_id/'+quiz_id+'/attempt_id/'+attempt_id;
			return $http.get(quizPlayUrl);

		};

		
	});