(function(){
	angular.module('io2v3')

	.controller('dashboardCtrl', dashboardCtrl);

	function dashboardCtrl($scope, auth){
		var vm = this;
		vm.name = 'salman ahmed';
		console.log('dashboard abract controller is activated');
		$scope.pageHeading = "";

	}

	dashboardCtrl.$inject = ['$scope', 'auth'];

})();