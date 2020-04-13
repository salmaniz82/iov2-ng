(function() {

    angular.module('io2v3').controller('dashboardEntityCtrl', ['API_URL', 'SITE_URL', '$scope', '$http', '$state', 'auth', '$rootScope', function(API_URL, SITE_URL, $scope, $http, $state, auth, $rootScope){


        var vm = this;


        $scope.stage = 1;


       $scope.$parent.base.pageUrl = $state.current.url; 

       vm.loadingStatus = null;
       vm.hasWeekSchedule = false;
       $scope.currentactivity = false;

       vm.topPerformer = false;

       vm.hasRecentFinished = false;





        $http.get(API_URL+'dashboard').then(

        	function(res) {

        		if(res.data.logo != undefined)
        		{


        			$scope.$parent.base.updateDashboardLogo();

        		}


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

        		if(res.data.recentFinished != undefined || res.data.recentFinished != false)
        		{
        			vm.hasRecentFinished = true;

        			vm.recentFinished = res.data.recentFinished;
        		}

        		if(res.data.topPerformer != undefined || res.data.topPerformer != false)
        		{
        			vm.topPerformer = true;

        			vm.topScorerList = res.data.topPerformer;
        		}

        		

        		if(res.data != undefined){
        		vm.loadingStatus = true;
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
		

		if(vm.loadingStatus)
		{

			var ctx = document.getElementById('myChart').getContext('2d');

		ctx.canvas.parentNode.style.height = '240px';
		ctx.canvas.parentNode.style.width = '420px';


		var myDoughnutChart = new Chart(ctx, config);

		}

		




		vm.clearActivity = function(attemptId)
		{

			
			var requestSuccess = function(res)
            {

                var notify = {
                        type: 'success',
                        title: 'Operation Successfull',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);


                    var idx = $scope.$parent.base.getIndex($scope.activeCandidates, 'attemptID', attemptId);
               
                	$scope.activeCandidates.splice(idx, 1);

                	if($scope.activeCandidates.length == 0)
                	{

                		$scope.currentactivity = false;

                	}




            };


            var requestError = function(res)
            {

                var notify = {
                        type: 'error',
                        title: 'Operation Failed',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);






            };


            $http({
                url : API_URL+'dashboard/markactivityinactive/'+attemptId,
                method : 'PUT',
                data : {'payload' : 'empty'}
            }).then(requestSuccess, requestError); 


		};


    }]);

})();
