angular.module('io2v3')
	.factory('authInterceptor', function() {

		oAuthIntercept = {};

		oAuthIntercept.request = function(config) {

			config.headers = config.headers || {};



			function getLocalTimeOffset() {
    			var offset = new Date().getTimezoneOffset(), o = Math.abs(offset);
    			return (offset < 0 ? "+" : "-") + ("00" + Math.floor(o / 60)).slice(-2) + ":" + ("00" + (o % 60)).slice(-2);
			}


			if(localStorage.auth_token)
			{
				config.headers.token = localStorage.auth_token;
			}

			config.headers.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			config.headers.timeOffset = getLocalTimeOffset();

			return config;

		};

		return oAuthIntercept;


	})

	.config(function($httpProvider) {

    	$httpProvider.interceptors.push('authInterceptor');

    });

    
	
