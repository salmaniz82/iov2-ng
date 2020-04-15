(function() {

    angular.module('io2v3').controller('userAgreementCtrl', ['API_URL', '$scope', '$http', '$stateParams', function(API_URL, $scope, $http, $stateParams){


        var vm = this;

        console.log('userAgreementCtrl updating for geolocation');


        vm.ua = {};


        $scope.ua_stages = 1;
        $scope.ua_one = 1;
        $scope.ua_two = null;
        $scope.ua_three = null;

        
        


        vm.switchInnerState = function(parentStage, childStage, stageIndex)
        {



        	if($scope.ua_stages == 1 && $scope.ua_one == 1 && !vm.ua.agreePolicy)
        	{

        		var notify = {
                        type: 'error',
                        title: 'Invalid',
                        content: 'You must agree to proceed further',
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);


                    

        		return false;
        	}

        	if($scope.ua_stages == 1 && $scope.ua_one == 1 && vm.ua.agreePolicy)
        	{

        		$scope[childStage] = stageIndex + 1;

        		return false;

        	}

        	if($scope.ua_stages == 1 && $scope.ua_one == 2)
        	{


        		var p1s2Invalid = false;

        		if(!vm.ua.location)
        		{
        			var notify = {
                        type: 'warning',
                        title: 'Geo Location',
                        content: 'You must must agree to allow your geolocation to proceed',
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

        			p1s2Invalid = true;
        		}

        		if(!vm.ua.camera)
        		{

        			var notify = {
                        type: 'warning',
                        title: 'Camera',
                        content: 'You must agree to allow your camera to proceed',
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);


                    p1s2Invalid = true;

        		}

        		if(!vm.ua.microphone)
        		{

        			var notify = {
                        type: 'warning',
                        title: 'Microphone',
                        content: 'You must agree to allow your microphone',
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                    p1s2Invalid = true;

        		}

        		if(!vm.ua.otherPolicies)
        		{

        			var notify = {
                        type: 'warning',
                        title: 'Other Policies',
                        content: 'You must agree to other policies to proceed',
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                    p1s2Invalid = true;

        		}

        		if(p1s2Invalid)
        		{

        			p1s2Invalid = false;
        			return false;
        		}



        		var permissions = ['geolocation', 'camera', 'microphone'];


        		navigator.permissions.query({name: 'geolocation'}).then(function(permission) {

        			if(permission.state == 'granted')
        			{
        				vm.hasGeolocation = true;
        			}

					else 
					{

						var notify = {
                        type: 'error',
                        title: 'GEOLOCATION',
                        content: 'Permission for location was not granted',
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                    p1s2Invalid = true;

                    return false;

					}

				});


				navigator.permissions.query({name: 'camera'}).then(function(permission) {

					if(permission.state == 'granted')
					{
						vm.hasCamera = true;
					}

					else
					{

						var notify = {
                        type: 'error',
                        title: 'CAMERA',
                        content: 'Permission for camera was not granted',
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                    return false;

                    p1s2Invalid = true;

					}

				});


				navigator.permissions.query({name: 'microphone'}).then(function(permission) {

					if(permission.state == 'granted')
					{

						vm.hasMicrophone = true;

					}
					else
					{

						var notify = {
                        type: 'error',
                        title: 'MICROPHONE',
                        content: 'Permission for Microphone was not granted',
                        timeout: 3000 //time in ms


                    };
                    $scope.$emit('notify', notify);

                    return false;

                    p1s2Invalid = true;

					}

				});


       			if(vm.hasGeolocation && vm.hasCamera && vm.hasMicrophone)
       			{
       				
       				$scope[childStage] = stageIndex + 1;
       				

       			}


        	}


        	console.log('parent stage' + $scope.ua_stages);


        	console.log('child stage' + childStage);

       		console.log('stage index' +stageIndex);


       			if($scope.ua_stages == 2 && $scope.ua_two == 1)
       			{

       				if(!vm.hasMicrophone)
       				{
       					vm.askMicrophonePermission();
       				}

       				if(!vm.hasCamera)
       				{
       					vm.askCameraPermission();
       				}



       				if(vm.hasMicrophone && vm.hasCamera)
       				{

       					$scope[childStage] = stageIndex + 1;

       				}

       			}


       			if($scope.ua_stages == 2 && $scope.ua_two == 2)
       			{
       					$scope[childStage] = stageIndex + 1;
       			}

       			if($scope.ua_stages == 3 && $scope.ua_three == 1)
       			{
       					$scope[childStage] = stageIndex + 1;
       			}

       			if($scope.ua_stages == 3 && $scope.ua_three == 2)
       			{
       					$scope[childStage] = stageIndex + 1;
       			}

       			



        };


        vm.changeParent = function (parentIndex)
        {

        
        	if(parentIndex == 1)
        	{
        		$scope.ua_two = 1;			
        	}

        	else if(parentIndex == 2)
        	{
        		$scope.ua_three = 1;
        	}

        	$scope.ua_stages = parentIndex + 1;





        };


        vm.askGeolocation = function()
        {


        	var success = function(position)
        	{

        		/*
        			got the location
        		*/
        		console.log('got the permission');

        		vm.hasGeolocation = true;

        	};

        	var error = function()
        	{

        		/*
        		failed while having geolocation
        		*/
        		console.log('failed to get location error');

        	};


        	if(vm.ua.location)
        	{
        		if(navigator.geolocation)
        		{
        			navigator.geolocation.getCurrentPosition(success, error);
        		}	
        	}


        	console.log('hasGeolocation' + vm.hasGeolocation);

        };


        vm.askMicrophonePermission = function()
        {

        	if(vm.ua.microphone)
        	{

        		if (!navigator.getUserMedia)
        		{
        			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia || navigator.msGetUserMedia;
		
        		}


        		navigator.mediaDevices.getUserMedia({ audio: true })
      				.then(function(stream) {

        				console.log('You let me use your mic!')

        				vm.hasMicrophone = true;
      			})
      			.catch(function(err) {

        			console.log('No Microphone pluged in')

      			});
            

        	}

        };


        vm.askCameraPermission = function()
        {

        	if(vm.ua.camera)
        	{

        		if (!navigator.getUserMedia)
        		{
        			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia || navigator.msGetUserMedia;
		
        		}


        		navigator.mediaDevices.getUserMedia({ video: true })
      				.then(function(stream) {

        				console.log('You let user your camera')

        				vm.hasCamera = true;
      			})
      			.catch(function(err) {

        			console.log('NO camera attached');

      			});
            

        	}

        };

        


    }]);

})();
