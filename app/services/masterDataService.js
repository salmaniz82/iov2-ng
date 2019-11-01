angular.module('io2v3')
	.service('masterDataService', ['$http', 'API_URL', '$cacheFactory', function($http, API_URL, $cacheFactory) {

		var masterUrl = API_URL+'masterdatalist';



		this.loadMaster = function()
		{
			
			return $http.get(masterUrl, {cache: true});
		};

		this.getCachedItems = function()
		{
		
			var requestCache = $cacheFactory.get('$http');
			return requestCache.get(masterUrl);

		};


		this.removeCache = function()
		{

			var httpCache = $cacheFactory.get('$http');
			httpCache.remove(masterUrl);

		};


	}]);