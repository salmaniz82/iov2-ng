(function() {

    angular.module('io2v3').controller('quizAttemptCtrl', ['API_URL', '$scope', '$http', '$state', '$stateParams', 'quizPlayData', '$timeout', function(API_URL, $scope, $http, $state, $stateParams, quizPlayData, $timeout){


        var vm = this;

        vm.quizData = quizPlayData.data;
        vm.questionIndex = 0;
        vm.activeQuestion = vm.quizData.questions[vm.questionIndex];

        var attempt_id = $stateParams.attempt_id;


        vm.hasPre = false;
        vm.hasMore = true;
        vm.showEndQuiz = false;


        vm.save = function()
        {

            var answerSaveUrl = API_URL+'std-patch-answers';

            $http({
                url : answerSaveUrl,
                method : 'POST',
                data : {
                    'answers' : vm.payloadAnswers
                }
            }).then(
                function(res){
                    
                    console.log(res);

                    $state.go('std.exams');

                }, 

                function(res){
                    console.log(res);
                });

        };


         vm.validAnswer = function()
         {


            if(vm.activeQuestion.answer == undefined)
            {                   
                
                return false;
            }

            else if (typeof(vm.activeQuestion.answer) === 'object')
            {
                
                for(var key in vm.activeQuestion.answer)
                {
                    if(vm.activeQuestion.answer.hasOwnProperty(key))
                    {
                        if(vm.activeQuestion.answer[key] == true)
                        {
                            return true;   
                        }
                    }
                }
                return false;
            }

            else if (vm.activeQuestion.answer == "")
            {
                return false;
            }

            else {
                return true;
            }

         };


        vm.ansPrep = function()
        {
            
            vm.answerAvailable = true;
            vm.payloadAnswers = [];

            for(var key in vm.providedAnswers)
            {             
                
                var answer = vm.providedAnswers[key].answer;
                if(typeof(answer) == "object")
                {

                    var tempArrOPtions = [];
                    for(var k in answer)
                    {
                        if(answer.hasOwnProperty(k))
                        {
                            if(answer[k] == true)
                            {
                                tempArrOPtions.push(k);
                            }
                        }
                    }
                    tempArrOPtions.sort();
                    answer = tempArrOPtions.join(",");
                }
                
                var tempObj = {
                        "attempt_id" : attempt_id,
                        "question_id" : vm.providedAnswers[key].questionId,
                        "answer" : answer
                }
                vm.payloadAnswers.push(tempObj);



            }

            vm.answerAvailable = true;
            vm.save();

        }


        vm.markedQuestions = [];
        vm.providedAnswers = [];
        vm.startReviewWizard = null;


        vm.startReview = function()
        {

            vm.startReviewWizard = true;
            vm.quizData.questions = vm.markedQuestions;
            vm.questionIndex = 0;            
            vm.activeQuestion = vm.markedQuestions[vm.questionIndex];
       
       };


        vm.revNext = function()
        {

            if(vm.validAnswer() && vm.questionIndex + 1 <= vm.markedQuestions.length)
            {
                vm.providedAnswers.push(vm.activeQuestion);
                vm.questionIndex += 1;
                vm.activeQuestion = vm.markedQuestions[vm.questionIndex];
            }
            else {
                return false;
            }

        };




        vm.isReviewEnabled = function()
        {

            if(vm.hasMore == false && vm.markedQuestions.length != 0)
            {
                return true;
            }

            else {
                return false;
            }

        }


        vm.nextQuestion = function()
        {


             var answerIndex = parseInt($scope.$parent.base.getIndex(vm.providedAnswers, 'id', vm.activeQuestion.id));
             var markedIndex = parseInt($scope.$parent.base.getIndex(vm.markedQuestions, 'id', vm.activeQuestion.id));


             if(!vm.validAnswer() && (vm.activeQuestion.marked == undefined || vm.activeQuestion.marked == false) )
             {
                return false;

             }
             else if (vm.activeQuestion.marked == true)
             {
                // add to mark
                
                if(markedIndex == -1)
                {
                    vm.markedQuestions.push(vm.activeQuestion);  
                } 


                if(answerIndex != -1)
                {
                    vm.providedAnswers.splice(answerIndex, 1);
                }

             }

             else if ( (vm.validAnswer() ) && (vm.activeQuestion.marked == undefined || vm.activeQuestion.marked == false) )
             {
                          
               if(answerIndex == -1)
               {
                    vm.providedAnswers.push(vm.activeQuestion);
               }

               if(markedIndex != -1)
               {
                    vm.markedQuestions.splice(markedIndex, 1);
               }

             }

    			vm.questionIndex +=1;
	   		    vm.activeQuestion = vm.quizData.questions[vm.questionIndex];
    			vm.checkNextPre();

        }


        vm.preQuestion = function()
        {

			vm.questionIndex -=1;
			vm.activeQuestion = vm.quizData.questions[vm.questionIndex];
			vm.checkNextPre();       	
        }

     	vm.checkNextPre = function()
        {

            if(vm.questionIndex == 0)
        	{
        		vm.hasPre = false;
        		vm.isLastQue = false;
        		vm.hasMore = true;
        	}
        	
        	else if( vm.questionIndex + 1 >= vm.quizData.questions.length + 1)
        	{
        		vm.hasMore = false;
                if(vm.markedQuestions.length == 0)
                {
                    vm.isLastQue = true;    
                }
        	}

        	else if (vm.questionIndex != 0)
        	{
        		vm.hasPre = true;		
        	}

        	else {

        	}

        	if (vm.questionIndex + 1 < vm.quizData.questions.length + 1)
        	{
        		vm.hasMore = true;
        		vm.isLastQue = false;
        	}



        };


        vm.checkNextPre();



        vm.durationMins = parseInt(vm.quizData.quiz[0].duration);

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

		       // console.log($scope.timeLeft);

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
