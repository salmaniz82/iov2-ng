(function(){

	angular.module('io2v3')
	.controller('modalCtrl', modalCtrl);



	function modalCtrl($state, $scope)
	{
		var vm = this;

		vm.modalOpen = false;




		vm.dataList = [
		{'id': '1', 'email': 'sa@isystematic.com'},
		{'id': '2', 'email': 'nk@isystematic.com'},
		{'id': '3', 'email': 'ak@isystematic.com'},
		{'id': '4', 'email': 'ua@isystematic.com'}
		];


		vm.launchModal = function(idx)
		{
			vm.modalId = idx;
			vm.modalOpen = true;
			vm.modalData = vm.dataList[idx];
			console.log(vm.modalData);
		}

	}



})();