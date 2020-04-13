(function(){
	angular.module('io2v3')

	.controller('dashboardCtrl', dashboardCtrl);

	function dashboardCtrl($scope, auth){
		var vm = this;
		vm.name = 'salman ahmed';
		console.log('dashboard abract controller is activated');
		$scope.pageHeading = "";


		$scope.isQuizActivated = false;


		 $scope.$emit('activeQuiz', {status : false});



		 /*

		 usage

		 $scope.$emit('activeQuiz', {status : true});

		 */





	}

	dashboardCtrl.$inject = ['$scope', 'auth'];





})();