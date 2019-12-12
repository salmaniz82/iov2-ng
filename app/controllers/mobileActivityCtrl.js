(function() {

    angular.module('io2v3').controller('mobileActivityCtrl', ['API_URL', '$scope', '$http', '$stateParams', '$rootScope', function(API_URL, $scope, $http, $stateParams, $rootScope){


        var vm = this;

        $scope.currentactivity = false;


        console.log('mobile activity');


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

        


    }]);

})();
