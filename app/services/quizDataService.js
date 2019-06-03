angular.module('io2v3')
	.service('quizDataService', function($http, API_URL) {

		this.getMasterQuiz = function(quiz_id)
		{
			
			var quizPlayUrl = API_URL+'quiz/subjects/'+quiz_id;
			return $http({

				 
				 url : quizPlayUrl,
				 method: 'GET'

			});

		};


		this.queGlobalFetch = function()
		{

			var urlforQuizGlobal = 	API_URL+'quiz-global';


			return $http({
				 
				 url : urlforQuizGlobal,
				 method: 'GET'

			});




		};


	});