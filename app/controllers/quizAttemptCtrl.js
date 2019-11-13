(function() {

    angular.module('io2v3').controller('quizAttemptCtrl', ['API_URL', '$scope', '$http', '$state', '$stateParams', 'quizPlayData', '$timeout', function(API_URL, $scope, $http, $state, $stateParams, quizPlayData, $timeout){


        var vm = this;

        vm.quizData = quizPlayData.data;

        vm.timeexpiration = false;

        const channel = new BroadcastChannel('sw-idxsaved');


        vm.lightBoxEnabled  = false;

        /*
        myRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg))/i
        let imagePath = "http://localhost:3001/App 12-0.png";
        console.log(myRegex.test(imagePath));
        */


        /*
        
        if(vm.quizData.action != undefined && vm.quizData.action == 'redirect')
        {
            
          return $state.go('onExamRefresh', {'quiz_id': $stateParams.quiz_id, 'attempt_id': $stateParams.attempt_id});

        }
        */


        vm.optionhasImage = function(optionsSTring)
        {

            myRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg))/i
            return myRegex.test(optionsSTring);
        };

        
        

        vm.closeCurrentWindow = function() {
            var version=0;
            if (navigator.appVersion.indexOf("MSIE")!=-1){
                        var temp=navigator.appVersion.split("MSIE");
                        version=parseFloat(temp[1]);
            }
            if (version>=5.5 && version<=6) {

                        this.focus();

                        self.opener = this;

                        self.close();

            } else {

                        window.open('','_parent','');

                        window.close();

            }

        };

        

        vm.questionIndex = 0;

        // new line added for decoding strings of object 

       // vm.quizData.questions = $scope.$parent.base.inboundDecode(vm.quizData.questions);

        vm.endActivated = false;

        vm.reviewAll = false;



        vm.activeQuestion = vm.quizData.questions[vm.questionIndex];

        var attempt_id = $stateParams.attempt_id;


        vm.ShowPulse = false;


        vm.TimeStatus = 'high';


        $scope.baseUrl = API_URL;


        vm.hasPre = false;
        vm.hasMore = true;
        vm.showEndQuiz = false;


        vm.save = function()
        {

            var answerSaveUrl = API_URL+'std-patch-answers';

            $timeout.cancel(vm.quizTimeInterval);
            

            var timeLeft = localStorage.getItem('lastStoredDurationSeconds');

            var endState = (vm.timeexpiration) ? 'timeout' : 'explicit';


            vm.quizMeta = {"endState" : endState,  "timeLeft" : timeLeft};


            vm.idbPayload = {
            "url" : answerSaveUrl,
            "method": 'POST',
            "data" : {'answers' : vm.payloadAnswers, 'quizMeta' : vm.quizMeta}
            };

            $http(vm.idbPayload).then(

                function(res){

                 //   $state.go('std.exams');
                       
                       vm.closeCurrentWindow();


                }, 

                function(res){
                if(res.status < 1)
                {
                    
                    console.log('LOST IC Trigger BackgroundSync');


                    vm.idbPayload.data.quizMeta.endState = 'Network Lost';



                    vm.triggerBackgroundSync(vm.idbPayload);


                    var notify = {
                        type: 'warning',
                        title: 'Internet Disconnected',
                        content: 'Progress has been saved and pushed to server as connection resumes',
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);



                    setTimeout(function() {

                        vm.closeCurrentWindow();
                        

                    }, 2000)

                }      
                 

                });


            localStorage.removeItem('lastStoredDurationSeconds');

        };


        vm.triggerBackgroundSync = function(payload)
        {

            var swPost = {
                 'form_data': payload
              };
      
            navigator.serviceWorker.controller.postMessage(swPost);

            channel.addEventListener('message', event => {

            if(event.data.status == 1 && window.cachedRegisterSW != undefined)
            {
                 window.cachedRegisterSW.sync.register('exam');
            }

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

            vm.endActivated = true;

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


       vm.startReviewAll = function()
       {


            vm.quizData.questions = vm.providedAnswers;


            for (var key in vm.quizData.questions) {

                if (vm.quizData.questions.hasOwnProperty(key)) {

                        if(vm.quizData.questions[key]['marked'] != undefined)
                        {
                            delete vm.quizData.questions[key]['marked'];
                        }

                    }
            }



            vm.questionIndex = 0;            
            vm.activeQuestion = vm.quizData.questions[vm.questionIndex];
            vm.reviewAll = true;

            vm.startReviewWizard = false;

            vm.markedQuestions = [];

            vm.isLastQue = false;


            



       };


        vm.revNext = function()
        {

            if(vm.validAnswer() && vm.questionIndex + 1 <= vm.markedQuestions.length)
            {
                vm.providedAnswers.push(vm.activeQuestion);
                vm.pushActivity(vm.questionIndex);
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

               vm.ShowPulse = true;     

                return false;

             }
             else if (vm.activeQuestion.marked == true)
             {
                // add to mark
                
                if(markedIndex == -1 && vm.reviewAll == false)
                {
                    vm.markedQuestions.push(vm.activeQuestion); 


                    
                    vm.ShowPulse = false;
                } 


                if(answerIndex != -1)
                {
                    vm.providedAnswers.splice(answerIndex, 1);
                    vm.ShowPulse = false;
                    
                }

             }

             else if ( (vm.validAnswer() ) && (vm.activeQuestion.marked == undefined || vm.activeQuestion.marked == false) )
             {
                          
               if(answerIndex == -1)
               {
                    vm.providedAnswers.push(vm.activeQuestion);
                    vm.ShowPulse = false;
                    
               }

               if(markedIndex != -1)
               {
                    
                    vm.markedQuestions.splice(markedIndex, 1);
                    vm.ShowPulse = false;
               }

             }


                vm.pushActivity(vm.questionIndex);

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


        vm.getLeftDurationInSeconds = function()
        {

            if(localStorage.hasOwnProperty('lastStoredDurationSeconds') && !isNaN(localStorage.getItem('lastStoredDurationSeconds')))
            {
                 
                 return localStorage.getItem('lastStoredDurationSeconds');

            }

             return parseInt(vm.quizData.quiz[0].duration) * 60;


        };


        
       


        //vm.durationMins = parseInt(vm.quizData.quiz[0].duration);

        var durationSeconds = vm.getLeftDurationInSeconds();

        var startMinutes = (durationSeconds / 60) | 0;
        var startSeconds = (durationSeconds % 60) | '00';

        $scope.timeLeft = startMinutes+':'+startSeconds;


        


        vm.startTimer = function (duration) {

		// converting minutes to seconds
        /*
		duration =  duration * 60;       	
        */


        



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


                var leftDurationSec = (minutes * 60) + seconds;

                var percentLeft = Math.round(leftDurationSec / (parseInt(vm.quizData.quiz[0].duration) * 60) * 100);


                if(percentLeft >= 70)
                {
                    vm.TimeStatus = 'high';
                }
                else if (percentLeft >= 50)
                {
                    vm.TimeStatus = 'med';
                }
                else {
                    vm.TimeStatus = 'low';
                }


                localStorage.setItem('lastStoredDurationSeconds', leftDurationSec);



		        minutes = minutes < 10 ? "0" + minutes : minutes;
		        seconds = seconds < 10 ? "0" + seconds : seconds;

		        $scope.timeLeft = minutes + ":" + seconds; 


                
                

		       

		        if (diff <= 0) {

			      vm.timeexpiration = true;

			      vm.manageTimeOutSubmission();



			      return false;

		        }else {

		        vm.quizTimeInterval = $timeout(timer, 1000);

		        }
		    };

	    timer();
	    	 
		};

		    
		vm.startTimer(durationSeconds);



        vm.manageTimeOutSubmission = function()
        {

            

            vm.timeexpiration = true;



            /*
            1. no question were marked
            2. marked length is present
                2.a retian provided answer
                2.b set u/a for not attempted
            3   what if  

            */

            if(vm.markedQuestions.length == 0 && vm.providedAnswers.length == vm.quizData.quiz[0].noques)
            {
                /*
                
                ALL ATTEMPTED ZERO MARKED

                */
                vm.ansPrep();
            }
            else if(vm.markedQuestions.length == (vm.quizData.quiz[0].noques - vm.providedAnswers.length) && vm.providedAnswers.length != 0)
            {               
                
                /*
                SOME ATTEMPTED REMAINDER IN MARKED
                */
                vm.manageMarkedOnTimeOut();
            }

            else if (vm.markedQuestions.length == vm.quizData.quiz[0].noques && vm.providedAnswers.length == 0)
            {
                /*
                ALL MARKED BUT ZERO PROVIDED AS ANSWER
                */
                vm.manageMarkedOnTimeOut();
            }

            else if (vm.markedQuestions.length == 0 && vm.providedAnswers.length ==0)
            {
                
                /*
                
                ZERO ACTIVITY
                NOT MARKED
                NOT ASNWER

                */
                vm.manageNoActivtiyOnTimeOut();

            }

            else if (vm.markedQuestions.length == 0 && vm.providedAnswers.length != vm.quizData.quiz[0].noques)
            {
                /*                   
                    NO MARKED
                    SOME ANSWERED 
                    SOME PENDING
                */
                vm.managePartiallyAnsweredNoMarked();

            }

            else if (vm.markedQuestions.length != 0 && vm.providedAnswers.length != vm.quizData.quiz[0].noques)
            {

                /*
                most crucial
                SOME MARKED
                SOME ANSWERED
                SOME PENDING
                */

                vm.manageTimoutAllAspect();


            }

            else {


               
            }

            vm.endActivated = true;

        };


        vm.manageMarkedOnTimeOut = function()
        {
         
            for(var key in vm.markedQuestions)
            {
                    var item = vm.markedQuestions[key];
                    
                    if(item.answer == undefined)
                    {
                        // item property is set
                        item.answer = 'u/a';
                    }

                    vm.providedAnswers.push(item);
              
            }
            vm.ansPrep();      

        };

        vm.manageNoActivtiyOnTimeOut = function()
        {


            vm.quizData.questions;

            for(var key in vm.quizData.questions)
            {
                var item = vm.quizData.questions[key];
                item.answer = 'u/a';
                vm.providedAnswers.push(item);
                

            }


            vm.ansPrep();

        };


        vm.managePartiallyAnsweredNoMarked = function()
        {

            var answerQuestionIDCollection = [];

            /*
                getting all questions_id which has already been answered in array
            */


            for(var key in vm.providedAnswers)
            {
                var item = vm.providedAnswers[key];
                answerQuestionIDCollection.push(item.questionId);
            }

            

            for(var key in vm.quizData.questions)
            {
                var item = vm.quizData.questions[key];
                if(!answerQuestionIDCollection.includes(item.questionId))
                {
                    /*
                    if already in answers than we don't need to include them again
                    */
                    if(item.answer == undefined) 
                    {
                        item.answer = 'u/a'
                    }


                    vm.providedAnswers.push(item);
                }

                
            }

            vm.ansPrep();

        };



        vm.manageTimoutAllAspect = function()
        {


            for(var key in vm.markedQuestions)
            {
                    var item = vm.markedQuestions[key];
                    
                    if(item.answer == undefined)
                    {
                        // item property is set
                        item.answer = 'u/a';
                    }

                    vm.providedAnswers.push(item);
              
            }

            var answerQuestionIDCollection = [];

            /*
                getting all questions_id which has already been answered in array
            */


            for(var key in vm.providedAnswers)
            {
                var item = vm.providedAnswers[key];
                answerQuestionIDCollection.push(item.questionId);
            }


            for(var key in vm.quizData.questions)
            {
                var item = vm.quizData.questions[key];
                if(!answerQuestionIDCollection.includes(item.questionId))
                {
                    /*
                    if already in answers than we don't need to include them again
                    */
                    if(item.answer == undefined) 
                    {
                        item.answer = 'u/a';
                    }


                    vm.providedAnswers.push(item);
                }

                
            }

            vm.ansPrep();

        };


        vm.implodeSingleAnswer = function(answer)
        {
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
                  return answer = tempArrOPtions.join(",");
                }

                return answer;
        }


        vm.pushActivity = function(lastIndex)
        {

             var tarQue = vm.quizData.questions[lastIndex] ;

            var pushPayload = {
                attempt_id : $stateParams.attempt_id,
                question_id : tarQue.questionId,
                answer : vm.implodeSingleAnswer(tarQue.answer),
                atype : (!vm.startReviewWizard) ? ((tarQue.marked) ? 'm' : 'a') : 'a',
                questionIndex: (!vm.startReviewWizard) ? lastIndex+1 : lastIndex+(vm.providedAnswers.length)
            };


         

         var pushUrl = API_URL+'recordActivity'; 

          $.ajax({
              type: "POST",
              url: pushUrl,
              data: pushPayload,
              dataType: 'json',
              success: function(res)
              {
                console.log('acivity pushed to server');
              }
              
         });


        };


        vm.launchLightbox = function(imgPath, imgCaption)
        {

            vm.lightBoxEnabled = true;

            console.log(imgPath);

            vm.fullImageSourceLink = imgPath;
            
            vm.fullImageTitle = imgCaption;

        };


        vm.closeLightBox = function()
        {

            vm.lightBoxEnabled = false;

        };


    }]);

})();
