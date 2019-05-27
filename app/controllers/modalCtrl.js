(function(){

	angular.module('io2v3')
	.controller('modalCtrl', modalCtrl);




	



	function modalCtrl($state, $scope, $http)
	{
		var vm = this;

		vm.modalOpen = false;

		$scope.$parent.base.pageUrl = $state.current.url; 




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



		$http.get('http://api.io2v3.dvp/test-enc-data').then(
		function(res){
			

			console.log(res.data.users);
			vm.encodedMessage = res.data.users;
			vm.decodedMessage = $scope.$parent.base.inboundDecode(vm.encodedMessage);


			console.log(vm.decodedMessage);



		}, 
		function(res){

		});

		


	}



	



})();