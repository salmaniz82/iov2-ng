angular.module('io2v3')
	.service('quizDataService', function($http, API_URL) {

		this.getMasterQuiz = function(quiz_id)
		{
			

			console.log('exam load initiated');

			var quizPlayUrl = API_URL+'quiz/subjects/'+quiz_id;
			return $http({

				 cache: true,
				 url : quizPlayUrl,
				 method: 'GET'

			});

		};


	});