angular.module('io2v3')
	.service('logService', [function() {

		this.justLog = function() 
		{
			console.log('This is a simple log message from a logger service');
		};

		this.logWithMessage = function(msg)
		{
			console.log('With Logger Service Your message :' + msg);
		};

	}]);