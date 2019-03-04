(function(){

	angular.module('io2v3')
	.controller('coreCtrl',	coreCtrl);



	function coreCtrl($state, $scope)
	{
		console.log('hello world from core Ctrl');
		//console.log($state.current.data.message);
	}



})();