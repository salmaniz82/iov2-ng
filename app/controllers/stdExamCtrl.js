(function() {

    angular.module('io2v3').controller('stdExamCtrl', ['API_URL', 'SITE_URL', '$scope', '$http', '$state', '$interval', function(API_URL, SITE_URL, $scope, $http, $state, $interval){


        var vm = this;
        vm.quizModal = false;
        vm.hasQuizEnrolled = null;
        vm.hasPendingQuiz = false;
        vm.hasAttemptedQuiz = false;
        vm.isInitiatStart = false;

        $scope.counter = [];


        

        localStorage.removeItem('lastStoredDurationSeconds');



        vm.initiateQuiz = function(enroll_id)
        {
          
            vm.isInitiatStart = true;
            /*
            var popup = window.open("http://localhost:8000/quiz-assement/177/24", "myPopup", 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width=1000,height=800')
            */

            $http({
                url : API_URL+'std-quiz-initiate',
                method : 'POST',
                data : {'enroll_id' : enroll_id}
            }).then(function(res){

                
                var resData = res.data;


                if(resData.usedXTimes != 0)
                {

                    vm.quizModal = false;

                    var notify = {
                        type: 'error',
                        title: 'Error',
                        content: resData.warning_message,
                        timeout: 8000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                    return false;


                }



                else if(resData.type == 'static')
                {
                    var attempt_id = res.data.attempt_id;
                    var stateargs = {'attempt_id' : attempt_id, 'quiz_id': vm.actQuiz.id};

                    var popupUrl = SITE_URL+'quiz-assement/'+attempt_id+'/'+vm.actQuiz.id;

                    vm.quizModal = false;
                    vm.isInitiatStart = false;

                    window.open(popupUrl, "Quiz", 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width=1200,height=800');


                   
                 //   $state.go('quizPlay', stateargs);
                }

                else if (resData.type == 'dls')
                {

                    $state.go('quizPlayDLS');
                }

                else {

                    console.log('quiz type is unknown');

                }
                

            },
            function(res){

                console.log(res);

            });

        };

        



        vm.launchQuizModal = function(quizId, reattempt = false)
        {

        	

            if(!reattempt)
            {
                var idx = $scope.$parent.base.getIndex(vm.dataList.quiz, 'id', quizId);
                vm.actQuiz = vm.dataList.quiz[idx];    
            }
            else {
                var idx = $scope.$parent.base.getIndex(vm.dataList.attempted, 'id', quizId);
                vm.actQuiz = vm.dataList.attempted[idx];
            }

            vm.quizModal = true;
            
        };


        function successFetchQuizList(res)
        {
        	
        	if(res.data.quiz != 0)
        	{       		
                vm.hasQuizEnrolled = true;
                vm.hasPendingQuiz = true;

        	}

            if (res.data.attempted != 0)
            {
                vm.hasAttemptedQuiz = true;
                vm.hasQuizEnrolled = true;
            }

        	if (res.data.quiz == 0 && res.data.attempted == 0){

        		vm.hasQuizEnrolled = false;	

        	}

            vm.dataList = res.data;

        	

        }

        function errorFetchQuizList(res)
        {       	

            if(res.data.quiz == 0 && res.data.attempted == 0)
            {
                vm.hasQuizEnrolled = false;    
            }

        }


        var url = API_URL+'std-quiz-list';

        $http({

        	url : url,
        	method: 'GET'

        }).then(successFetchQuizList, errorFetchQuizList);



        vm.showCountdown = function(quizId, dtEnrolled, dtsScheduled)
        {



        var enrolledDT =  new Date(dtEnrolled).getTime();    
        var scheduleDT = new Date(dtsScheduled).getTime();
        var currentDT = new Date().getTime();

        if(scheduleDT > currentDT)
        {

            console.log('work for countdown');


                var inc = 1;
            

            var countdownHandle = $interval(function(){


            var now = new Date().getTime();

            var distance = scheduleDT - now;

            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);


            if(distance <= 0)
            {
                
                $interval.cancel(countdownHandle);
                var idx = $scope.$parent.base.getIndex(vm.dataList.quiz, 'id', quizId);
                vm.dataList.quiz[idx].schedule = 'eligible';

            }

            

                if(days == 0 && hours == 0)
                {
                    $scope.counter[quizId] = minutes + " mins " + seconds + " secs ";
                }

               else {

                    $scope.counter[quizId] = days + " DD " + hours + " HH "
                + minutes + " mm " + seconds + " ss ";

                }

                console.log(distance);

            },1000);



        }





        /*    
        var countdownHandle = $interval(function(){
            //$interval.cancel(promise);
            console.log('hello I am the countdown timer for the quiz' + quizId);
        },1000);

        */

            
        };



        



    }]);

})();
