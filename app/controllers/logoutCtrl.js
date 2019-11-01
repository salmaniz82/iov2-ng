(function(){
	angular.module('io2v3')

	.controller('logoutCtrl', ['$state', '$timeout', 'auth', function ($state, $timeout, auth, $cacheFactory){
		
		var vm = this;



		auth.clearAllhttpCache();


		localStorage.removeItem('auth_token');
       	localStorage.removeItem('hdauEn');	
		$state.go('ua.login');



	}]);



})();