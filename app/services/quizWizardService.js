angular.module('io2v3')
	.service('quizWizardService', ['$http', 'API_URL', function($http, API_URL) {

		this.getPresetValues = function(quiz_id)
		{
			var preSetUrl = API_URL+'quiz-wizard-preset';
			return $http({
				 url : preSetUrl,
				 method: 'GET'
			});
		};


		this.saveQuizWizardData = function() 
		{

			// logic to save and do the rest;	

		};


		this.loadPreDistributionInfo = function(dataPayload)
		{
	
			var url = API_URL+'quizwizardsubjects';

			return $http({
				 url : url,
				 method: 'POST',
				 data: dataPayload
			});

		};


	}]);