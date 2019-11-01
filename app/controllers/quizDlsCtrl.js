(function() {

    angular.module('io2v3').controller('quizDlsCtrl', ['API_URL', '$scope', '$http', '$stateParams', 'quizPlayData', '$timeout', '$state', function(API_URL, $scope, $http, $stateParams, quizPlayData, $timeout, $state){


        var vm = this;


        vm.timeexpiration = false;




        vm.quizData = quizPlayData.data;


        /*

        if(vm.quizData.action != undefined && vm.quizData.action == 'redirect')
        {
            
          return $state.go('onExamRefresh', {'quiz_id': $stateParams.quiz_id, 'attempt_id': $stateParams.attempt_id});

        }

        */


        const channel = new BroadcastChannel('sw-idxsaved');        




        vm.closeCurrentWindow = function() {

          
          window.close();
            

        };



        vm.levels = ['easy', 'medium', 'difficult'];

        vm.activeLevel = vm.levels[0];

        vm.questionIndex = 0;

        vm.currentSubjectIndex = 0;

        vm.quiz = vm.quizData.quiz;

        vm.endOfSubjects = false;

        vm.diffDirection = 0;

        vm.endActivated = false;

        vm.endProcessActivated = false;

        vm.TimeStatus = 'high';

        /*
        vm.stream.collections[vm.currentSubjectName].composite['medium'].length != 0
        */

        vm.requiredQuestions = parseInt(vm.quiz.noques);

        /*

        vm.stream = $scope.$parent.base.inboundDecode(vm.quizData.stream);

        */

        vm.stream = vm.quizData.stream;

        vm.quiz.noques;

        vm.switchFrequency = 1;

        vm.mainNext = false;


     
        vm.noSubjects = vm.stream.distribution.length;
        

        vm.currentSubjectName =  vm.stream.distribution[vm.currentSubjectIndex].subjects;


        /*
        console.log(vm.stream.distribution);
        console.log(vm.stream.collections);
        console.log(vm.stream.collections[vm.currentSubjectName].composite[vm.activeLevel]);
        */


        vm.startReviewWizard = false;

        vm.reviewAll = false;


        vm.startReviewAll = function()
        {

            vm.reviewAll = true;

            vm.questionIndex = 0;

        }


        vm.revNext = function()
        {

           
           if(vm.questionIndex + 1 < vm.quiz.noques)
           {
              vm.questionIndex += 1;   
           }

           else {

            

            vm.triggerProcessEndQuiz();

           }


        };


        vm.questions = [];

        /*

        methods 

        vm.initializeQuestions();
        vm.prepareSubjectPerformanceIndicatorProperties();
        vm.primaryNextProcedure();
        vm.subjectProcedure();
        vm.difficultyProcedure();
        vm.difficultySwitcher();
        vm.levelSwitchCheckpoint();
        vm.markSubjectAnswered();
        vm.pushIndicator();
        vm.validAnswer();



        */


        vm.initializeQuestions = function()
        {

            console.log('question inint subject ' + vm.currentSubjectName + ' difflevel ' + vm.activeLevel);

            var currentQuestions = vm.stream.collections[vm.currentSubjectName].composite[vm.activeLevel][0];
            vm.questions.push(currentQuestions);
            vm.stream.collections[vm.currentSubjectName].composite[vm.activeLevel].splice(0, 1);

             console.log('stampAnswer' + currentQuestions.stamp);

            vm.mainNext = true;

        };


        vm.questionAvailableInCurrentDifficultyLevel = function()
        {


            console.log('questions available diff intercept' + vm.diffDirection + vm.activeLevel);


            if(vm.diffDirection == 1)
            {
                
                // upgrade

                if(vm.activeLevel == 'medium')
                {

                    
                    if(vm.stream.collections[vm.currentSubjectName].composite[vm.activeLevel].length != 0)
                    {
                        
                        vm.activeLevel = 'medium';

                    }   

                    else if(vm.stream.collections[vm.currentSubjectName].composite[vm.activeLevel].length == 0 && vm.stream.collections[vm.currentSubjectName].composite['difficult'].length != 0)
                    {

                         console.log('Updrade : no question in medium skiped to difficult');
                         vm.activeLevel = 'difficult';

                    }

                    else if (vm.stream.collections[vm.currentSubjectName].composite['easy'].length != 0)
                    {

                         console.log('upgrade but downn graded to easy no question is medium and diffult');

                    }

                    else {

                        console.log('upgrade : unknown condition');

                    }

                }

                

                else if(vm.activeLevel == 'difficult')
                {
                   

                   console.log('intercept from diffcult');
                   
                  if(vm.stream.collections[vm.currentSubjectName].composite[vm.activeLevel].length != 0)
                  {
                        vm.activeLevel = 'difficult';
                  }      
                   else if(vm.stream.collections[vm.currentSubjectName].composite[vm.activeLevel].length == 0 && vm.stream.collections[vm.currentSubjectName].composite['medium'].length != 0)
                   {
                        vm.activeLevel = 'medium';
                        console.log('upgrade : but downgrading to medium no questions remain in difficult');
                   }     

                   else if(vm.stream.collections[vm.currentSubjectName].composite[vm.activeLevel].length == 0 && vm.stream.collections[vm.currentSubjectName].composite['medium'].length == 0 && vm.stream.collections[vm.currentSubjectName].composite['easy'].length != 0)
                   {
                        vm.activeLevel = 'easy';
                        console.log('upgrade : but switched to easy no question in med or difficult');
                   }


                }




            }    
            else if (vm.diffDirection == -1) 
            {
                
                // downgrade

                if(vm.activeLevel == 'medium')
                {

                  if(vm.stream.collections[vm.currentSubjectName].composite[vm.activeLevel].length != 0)
                  {
                        vm.activeLevel = 'medium';
                  }

                  else if(vm.stream.collections[vm.currentSubjectName].composite['easy'].length != 0)
                  {
                        vm.activeLevel = 'easy'; 
                        console.log('downgrade : switched from med to easy no question available in')
                  }

                  else {

                        vm.activeLevel = 'dificult';
                        console.log('downgrade : switched from med to difficult no question available in medium or easy');

                  }



                }

                else if(vm.activeLevel == 'easy')
                {

                  if(vm.stream.collections[vm.currentSubjectName].composite[vm.activeLevel].length != 0)
                  {
                        vm.activeLevel = 'easy';
                  }

                  else if(vm.stream.collections[vm.currentSubjectName].composite['medium'].length != 0)
                  {
                        vm.activeLevel = 'medium';
                  }

                  else {

                        vm.activeLevel = 'difficult';

                  }



                }


            }

            else if (vm.diffDirection == 0)
            {

                // stay at current level


                if(vm.activeLevel == 'easy')
                {

                  if(vm.stream.collections[vm.currentSubjectName].composite['easy'].length != 0)
                  {
                        vm.activeLevel = 'easy';
                  }

                  else if(vm.stream.collections[vm.currentSubjectName].composite['medium'].length != 0)
                  {
                        vm.activeLevel = 'medium';
                  }

                  else {

                    vm.activeLevel = 'difficult';

                  }

                }

                else if(vm.activeLevel == 'medium')
                {


                  if(vm.stream.collections[vm.currentSubjectName].composite['medium'].length != 0)
                  {
                        vm.activeLevel = 'medium';
                  }

                  else if(vm.stream.collections[vm.currentSubjectName].composite['difficult'].length != 0)
                  {
                        vm.activeLevel = 'difficult';
                  }
                  else {

                    vm.activeLevel = 'easy';

                  }



                }

                else if(vm.activeLevel == 'difficult')
                {
                  
                  if(vm.stream.collections[vm.currentSubjectName].composite['difficult'].length != 0)
                  {
                        vm.activeLevel = 'difficult';
                  }

                  else if (vm.stream.collections[vm.currentSubjectName].composite['medium'].length != 0)
                  {
                       vm.activeLevel = 'medium';
                  }

                  else {

                    vm.activeLevel = 'easy';

                  }


                }


            }



        };



        vm.initializeQuestions();

        

        /*
        	vm.dataSource;
	        easy equal all required
	        next Protocols 
        */

        /*

			vm.performanceIndicator : {
				easy : [],
				medium : [],
				hard : []
			}

	        vm.mediumQuestions
    	    vm.easyQuestions
        	vm.difficultsQuestions
	
			vm.questionsStream:

			whatever the choosen questions according to matric will be pulled in 


        */


        vm.prepareSubjectPerformanceIndicatorProperties = function()
        {
            for (var i = 0;  i < vm.noSubjects; i++) {
            vm.stream.distribution[i].PerformanceIndicator = {

                easy : [],
                medium : [],
                difficult : []
            };
            
        }

        };

        vm.prepareSubjectPerformanceIndicatorProperties();


        

 /*

           vm.stream.distribution.
           vm.currentSubjectIndex;
           vm.currentSubjectName;
           vm.questionIndex

           */

           /*
                - check what subject you are on
                - check if quePerSubject has a room 
                - if room continue with subject 
                - or change the subject and level would be easy 
                - how many answered we have per subject 
           */



        vm.primaryNextProcedure = function ()
        {
          
          
           if(vm.validAnswer() && vm.questions[vm.questionIndex].answer != null)
           {
                

                vm.mainNext = false;


                console.log(vm.questions[vm.questionIndex].answer);
                vm.markSubjectAnswered();

                if(vm.questions.length < vm.quiz.noques)
                {

                    vm.pushIndicator();

                    vm.difficultyProcedure();

                    vm.questionAvailableInCurrentDifficultyLevel();      

                    vm.initializeQuestions();

                    vm.questionIndex += 1;

                }

                else if (vm.questions.length == vm.quiz.noques)
                {
                    
                    vm.endActivated = true;
                }

           }

           else {
                    
                    /*
                      invalid answer cannot move further
                    */

                    console.log('invalid attempt');

           }

           

        };


        vm.subjectProcedure = function()
        {

            /*
            vm.currentSubjectIndex
            vm.noSubjects
            vm.currentSubjectName
            */

            console.log('called subject procedure');

            if(vm.currentSubjectIndex + 1 < vm.noSubjects )
            {
                vm.currentSubjectIndex += 1;
            }

            else {
                vm.endOfSubjects = true;
            }


            vm.currentSubjectName =  vm.stream.distribution[vm.currentSubjectIndex].subjects;

        };


        vm.difficultyProcedure = function()
        {

               var levelAction = vm.levelSwitchCheckpoint(vm.switchFrequency);
               vm.difficultySwitcher(levelAction);

               if(vm.stream.distribution[vm.currentSubjectIndex].subjectOverloaded || vm.endOfSubjects)
                {
                    vm.subjectProcedure();
                }
   
                
        };


        vm.difficultySwitcher = function(levelAction)
        {


            if(levelAction === 1)
            {
                // upgrade 

                vm.diffDirection = 1;

                console.log('difficulty detected');


                if(vm.activeLevel == 'easy')
                {
                    console.log('upgraded to medium from easy');
                    vm.activeLevel = 'medium';
                }

                else if (vm.activeLevel == 'medium')
                {   
                    console.log('upgraded to difficult from medium');
                    vm.activeLevel = 'difficult';
                } 

                else {

                    console.log('upgrade already at difficult level');

                }

                

            }

            else if (levelAction === -1)
            {

                // downgrade levels

                vm.diffDirection = -1;

                console.log('Downgrade deteced from' + vm.activeLevel);

                if(vm.activeLevel == 'difficult')
                {

                    console.log('downgraded to medium from difficult');    

                    vm.activeLevel = 'medium';
                }

                else if (vm.activeLevel == 'medium')
                {
                     vm.activeLevel = 'easy';
                     console.log('downgraded to easy from medium');
                }

                else 
                {
                    console.log('downgraded already at easy');
                    vm.activeLevel = 'easy';
                }
                
            }

            else if (levelAction === 0)
            {
                // no change in levels
                console.log('no change in difficulty action level :  ' + levelAction);
                vm.diffDirection = 0;
            }


        };


        vm.levelSwitchCheckpoint = function(frequency)
        {

            /*
                get the lenght of items in indicators 
            */  

            var activeLevel = vm.activeLevel;
            var indicatorLength = vm.stream.distribution[vm.currentSubjectIndex].PerformanceIndicator[activeLevel].length;  

            console.log(vm.stream.distribution[vm.currentSubjectIndex].PerformanceIndicator);

            console.log('inicator length' + indicatorLength);

            if(indicatorLength >= frequency )
            {
                
                console.log('indicator length' + indicatorLength);

                var slicedFreqArray = vm.stream.distribution[vm.currentSubjectIndex].PerformanceIndicator[activeLevel].slice(-(frequency));


                var indicatoryOutput = slicedFreqArray.reduce((a, b) => a + b, 0);

                if(indicatoryOutput == frequency)
                {
                    
                    return 1;

                }
                else {

                    return -1;

                }
            }
            else {

                return 0;

            }



        };



        vm.markSubjectAnswered = function()
        {

            var queRequiredPerSubject = parseInt(vm.stream.distribution[vm.currentSubjectIndex].quePerSection);


            if(vm.stream.distribution[vm.currentSubjectIndex].answered == undefined)
            {
                vm.stream.distribution[vm.currentSubjectIndex].answered = 1;   
            }
            else if( queRequiredPerSubject > parseInt(vm.stream.distribution[vm.currentSubjectIndex].answered) ) {

                vm.stream.distribution[vm.currentSubjectIndex].answered += 1;
            }
            else {}


            if (queRequiredPerSubject == parseInt(vm.stream.distribution[vm.currentSubjectIndex].answered)) {
                
                vm.stream.distribution[vm.currentSubjectIndex].subjectOverloaded = true;

                console.log('subject overloaded');
                
            }


        };


        vm.returnFormattedAnswer = function(answer)
        {

            vm.payloadAnswers = [];
    
                
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

                    return answer;
                }

                else {
                    return answer;
                }
                
           
         };





        vm.pushIndicator = function()
        {
           

                var proivdedAnswer = vm.returnFormattedAnswer(vm.questions[vm.questionIndex].answer);

                var Indicator = (proivdedAnswer == vm.questions[vm.questionIndex].stamp) ? 1 : 0;

                console.log('proivded Answer :' + proivdedAnswer);

                console.log('correct answer :' +  vm.questions[vm.questionIndex].stamp);

                var activeLevel = vm.activeLevel              

                vm.stream.distribution[vm.currentSubjectIndex].PerformanceIndicator[activeLevel].push(Indicator);

                if(Indicator)
                {
                    console.log('correct provided answer');
                }

                else {

                    console.log('incorrect wrong answer');

                }

            
        };



        vm.validAnswer = function()
         {


            if(vm.questions[vm.questionIndex].answer == undefined)
            {                   
                
                return false;
            }

            else if (typeof(vm.questions[vm.questionIndex].answer) === 'object')
            {
                
                for(var key in vm.questions[vm.questionIndex].answer)
                {
                    if(vm.questions[vm.questionIndex].answer.hasOwnProperty(key))
                    {
                        if(vm.questions[vm.questionIndex].answer[key] == true)
                        {
                            return true;   
                        }
                    }
                }
                return false;
            }

            else if (vm.questions[vm.questionIndex].answer == "")
            {
                return false;
            }

            else {

                return true;

            }

         };


         vm.triggerProcessEndQuiz = function()
         {


            vm.endProcessActivated = true;

            vm.buildPayloadSanitizeAnswers();

            vm.save();


            if(localStorage.hasOwnProperty('lastStoredDurationSeconds'))
            {
               localStorage.removeItem('lastStoredDurationSeconds');         
            }


         };


        vm.buildPayloadSanitizeAnswers = function()
        {
            
            
            vm.payloadAnswers = [];

            var attempt_id = $stateParams.attempt_id;

            for(var key in vm.questions)
            {             
                
                var answer = vm.questions[key].answer;
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

                else if(answer == undefined)
                {
                    answer = 'u/a';   
                }
                
                var tempObj = {
                        "attempt_id" : attempt_id,
                        "question_id" : vm.questions[key].questionId,
                        "answer" : answer
                }

                vm.payloadAnswers.push(tempObj);

            }

        }


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
                                    
                    /*
                    $state.go('std.exams');
                    */

                    vm.closeCurrentWindow();


                }, 

                function(res){

                  if(res.status < 1)
                  {

                    vm.idbPayload.data.quizMeta.endState = 'Network Lost';
                    vm.triggerBackgroundSync(vm.idbPayload);

                  }

                    vm.closeCurrentWindow();  


                });

        };


        vm.getLeftDurationInSeconds = function()
        {

            if(localStorage.hasOwnProperty('lastStoredDurationSeconds') && !isNaN(localStorage.getItem('lastStoredDurationSeconds')))
            {
                 
                 return localStorage.getItem('lastStoredDurationSeconds');

            }

             return parseInt(vm.quiz.duration) * 60;


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

                var percentLeft = Math.round(leftDurationSec / (parseInt(vm.quiz.duration) * 60) * 100);


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
             
             vm.triggerProcessEndQuiz();        

        };



    }]);

})();
