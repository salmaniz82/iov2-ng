(function() {

    angular.module('io2v3').controller('dashboardEntityCtrl', ['API_URL', 'SITE_URL', '$scope', '$http', '$state', 'auth', '$rootScope', function(API_URL, SITE_URL, $scope, $http, $state, auth, $rootScope){


        var vm = this;


       $scope.$parent.base.pageUrl = $state.current.url; 

       vm.loadingStatus = null;
       vm.hasWeekSchedule = false;
       $scope.currentactivity = false;




       



        $http.get(API_URL+'dashboard').then(

        	function(res) {


        		if(res.data.actvity != undefined && res.data.actvity.length != 0)
        		{
        		
        			$scope.activeCandidates = res.data.actvity;
        			$scope.currentactivity = true;


        		}

        		if(res.data.weekSchedule != undefined)
        		{
        			vm.hasWeekSchedule = true;
        			vm.weekSchedule = res.data.weekSchedule;		
        		}


        	}, function(res) {

        		$scope.currentactivity = false;

        	});



        /*
        
        API	/dasboard/activity?


        */


		setTimeout(function() {

			if($rootScope.pooling == undefined || $rootScope.pooling.statusText == 'abort')
			{
				vm.getContent(null);

				console.log('run when null assinged');
			}

		});

        
        vm.getContent = function(timestamp)
		{
		    var queryString = {'timestamp' : timestamp || null};

		$rootScope.pooling =  $.ajax(
		        {
		            type: 'GET',
		            url: API_URL+'dasboard/activity',
		            data: queryString,
		            headers: {
		            	'token' : localStorage.auth_token
		            },
		            success: function(res){
		                // put result data into "obj"

		              //  console.log(res);

		                if(res.activity)
		                {
		                	$scope.currentactivity = true;

		                	$scope.activeCandidates = res.activity;	

		                	console.log($scope.activeCandidates);


		                	
        			$("#actIndicator").addClass('wobble').removeClass('c-blue');
        			
        			setTimeout(function() {
        				
        				

        				$("#actIndicator").removeClass('wobble').addClass('c-blue');
					

        			}, 1000);


		                	
		                }

		                else {

		                	$scope.currentactivity = false;

		                }

		                

		                vm.getContent(res.timestamp);

		                $scope.$apply();
		                
		            }
		        }
		    );
		};



		vm.getContent(null);


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
