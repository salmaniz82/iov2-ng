(function(){

	angular.module('io2v3')
	.controller('modalCtrl', modalCtrl);




	

	modalCtrl.$inject = ['$state', '$scope', '$http'];

	function modalCtrl($state, $scope, $http)
	{
		var vm = this;

		vm.modalOpen = false;

		$scope.$parent.base.pageUrl = $state.current.url; 


		vm.triggetEmit = function(soundEventType)
		{

			var msg = 'this is triggered from modalCtrl and function is reponding from baseCtrl';

			$scope.$emit('playSound', { message: soundEventType });

		};




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



		$http.get(API_URL+'test-enc-data').then(
		function(res){
			

			console.log(res.data.users);
			vm.encodedMessage = res.data.users;
			vm.decodedMessage = $scope.$parent.base.inboundDecode(vm.encodedMessage);


			console.log(vm.decodedMessage);



		}, 
		function(res){

		});





		vm.convertDates = function(dateInput)
		{

			var dt = new Date(dateInput);


			var offset = dt.getTimezoneOffset();

			if(offset > 0)
			{

				dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());

			}

			else {

				dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());

			}


			var year = dt.getFullYear();

			var month = (dt.getMonth() <= 9) ? '0'+dt.getMonth() : dt.getMonth();

			var day = (dt.getDate() <= 9) ? '0'+dt.getDate() : dt.getDate();

			var hour = (dt.getHours() <= 9 ) ? '0'+dt.getHours() : dt.getHours();

			var minutes = (dt.getMinutes() <=9) ? '0'+dt.getMinutes() : dt.getMinutes();

			var seconds = (dt.getSeconds() <= 9) ? '0'+dt.getSeconds() : dt.getSeconds();

			var dateString =  year+'-'+month+'-'+day +' '+hour+':'+minutes+':'+seconds;

			return dateString;

			

		};

	}


	
	
})();