(function() {

    angular.module('io2v3').controller('dashLandCtrl', ['API_URL', '$scope', '$http', '$state', function(API_URL, $scope, $http, $state){


        var vm = this;


       // $state.go('dash.admindashboard');


        vm.loadingStatus = null;

        console.log('dashboard contents here');



  		var randomScalingFactor = function() {
			return Math.round(Math.random() * 100);
		};


						window.chartColors = {
			red: 'rgb(255, 99, 132)',
			orange: 'rgb(255, 159, 64)',
			yellow: 'rgb(255, 205, 86)',
			green: 'rgb(75, 192, 192)',
			blue: 'rgb(54, 162, 235)',
			purple: 'rgb(153, 102, 255)',
			grey: 'rgb(201, 203, 207)'
				};


		var config = {
			type: 'doughnut',
			data: {
				datasets: [{
					data: [
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
					],
					backgroundColor: [
						window.chartColors.red,
						window.chartColors.orange,
						window.chartColors.yellow,
						window.chartColors.green,
						window.chartColors.blue,
					],
					label: 'Dataset 1'
				}],
				labels: [
					'Terminated',
					'Failed',
					'In progress',
					'Passed',
					'High Performant'
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio : true,
				legend: {
					position: 'left',
				},
				title: {
					display: true,
					text: ''
				},
				animation: {
					animateScale: true,
					animateRotate: true
				}
			}
		};
		

		var ctx = document.getElementById('myChart').getContext('2d');

		ctx.canvas.parentNode.style.height = '240px';
		ctx.canvas.parentNode.style.width = '420px';


		var myDoughnutChart = new Chart(ctx, config);		


    }]);

})();
