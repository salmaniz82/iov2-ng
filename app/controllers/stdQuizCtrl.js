(function() {

    angular.module('io2v3').controller('stdQuizCtrl', ['API_URL', '$scope', '$timeout', function(API_URL, $scope, $timeout){


    	/*


    	window.open('http://localhost:8000/quiz','winname','directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=400,height=350');

    	window.open('http://localhost:8000/quiz','winname',"directories=0,titlebar=0,toolbar=0,location=0,status=0,menubar=0,scrollbars=no,resizable=no,width=400,height=350");


    	window.open('http://localhost:8000/quiz', 'liveMatches', 'width=720,height=800,toolbar=0,location=0, directories=0, status=0,
location=no
,menubar=0');


    	*/


        var vm = this;
        vm.durationMins = .3;

        $scope.timeLeft = vm.durationMins+':00';

        vm.startTimer = function (duration) {

		// converting minutes to seconds
		duration =  duration * 60;       	

	    var start = Date.now(),
	        diff,
	        minutes,
	        seconds;

		    function timer() {
		        // get the number of seconds that have elapsed since 
		        // startTimer() was called
		        diff = duration - (((Date.now() - start) / 1000) | 0);

		        // does the same job as parseInt truncates the float
		        minutes = (diff / 60) | 0;
		        seconds = (diff % 60) | 0;

		        minutes = minutes < 10 ? "0" + minutes : minutes;
		        seconds = seconds < 10 ? "0" + seconds : seconds;

		        $scope.timeLeft = minutes + ":" + seconds; 

		        console.log($scope.timeLeft);

		        if (diff <= 0) {

			      //$timeout.cancle(toid);
			      console.log('timer has ended');
			      return false;

		        }else {

		        	$timeout(timer, 1000);

		        }
		    };

	    timer();
	    	 
		};

		    
		vm.startTimer(vm.durationMins);
		    
		

    }]);

})();
