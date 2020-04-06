(function() {

    angular.module('io2v3').controller('quizDlsCtrl', ['API_URL', '$scope', '$http', '$stateParams', 'quizPlayData', '$timeout', '$state', '$rootScope', function(API_URL, $scope, $http, $stateParams, quizPlayData, $timeout, $state, $rootScope){


        var vm = this;


        vm.timeexpiration = false;

        $scope.cachedImages = [];

        vm.quizData = quizPlayData.data;


        vm.lightBoxEnabled  = false;



        if(vm.quizData.imagesPreload.length != false)
        {

            $scope.imageLocations = vm.quizData.imagesPreload;

            var absoluteUrlPattern = new RegExp("^(http|https)://", "i");

            $scope.imageLocations.forEach(function(imageUrl) {



                imageUrl = decodeURIComponent(imageUrl);

                
                


                

                if(!absoluteUrlPattern.test(imageUrl))
                {

                   console.log(imageUrl + 'is absolute');
                   imageUrl = API_URL+imageUrl;
                }

                
                let imageUrlRequest = new Request(imageUrl);

                

                fetch(imageUrlRequest, {mode: 'no-cors'}).then(function(res) {


                        caches.open('quizImageCache').then(function(cache) {

                            cache.put(imageUrlRequest, res.clone());

                        });


                }).catch(function(erro) {

                    console.log(error);

                });


            });    
         
        }




        vm.optionhasImage = function(optionsSTring)
        {
            myRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg))/i
            return myRegex.test(optionsSTring);
        };



        

        vm.entityLogo = function()
        {


            if(vm.quizData.entityLogo[0].logo)
            {
                return API_URL+vm.quizData.entityLogo[0].logo;
            }

            else {
                return 'assets/images/iSkillMetrics-logo.svg';
            }


        };


        

        if(vm.quizData.action != undefined && vm.quizData.action == 'redirect')
        {
            
          return $state.go('onExamRefresh', {'quiz_id': $stateParams.quiz_id, 'attempt_id': $stateParams.attempt_id});

        }

        



        /*  
        commit broadcast api not working in safari
        const channel = new BroadcastChannel('sw-idxsaved');        
        */


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



        vm.closeCurrentWindow = function() {
         
            console.log('attempt to close window');

            console.log(window.quizWindow);


            if(window.quizWindow != undefined)
            {
               console.log('quiz window attached to root');
               window.quizWindow.close();
            }

            else {

                console.log('redirect compilted page');
                    
                $state.go('quizcomplited');

            }      

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
              
              $scope.$emit('playSound', { message: 'quiz-next' });

              vm.pushAnswerToActivity();
              vm.questionIndex += 1;   

              


           }

           else {

            vm.pushAnswerToActivity();
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


        vm.pushAnswerToActivity = function()
        {

          var currentIndex = vm.questionIndex;

          var tarQue = vm.questions[currentIndex];

          var formattedAnswer = vm.returnFormattedAnswer(tarQue.answer);

          
            var pushPayload = {
                attempt_id : $stateParams.attempt_id,
                question_id : tarQue.questionId,
                answer : formattedAnswer,
                atype : 'a',
                questionIndex: (++currentIndex)
            };


        
          console.log(pushPayload);


          var pushUrl = API_URL+'recordActivity'; 

          $.ajax({
              type: "POST",
              url: pushUrl,
              data: pushPayload,
              dataType: 'json',
              success: function(res)
              {
                console.log('activity logged to server');
              }
              
         });



        };




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

                    console.log('push activity checkpoint');

                    vm.pushAnswerToActivity();

                    vm.questionIndex += 1;


                    $scope.$emit('playSound', { message: 'quiz-next' });

                }

                else if (vm.questions.length == vm.quiz.noques)
                {

                  vm.pushAnswerToActivity();
                    
                    vm.endActivated = true;
                }

           }

           else {
                    

                    console.log('invalid attempt');

                    $scope.$emit('playSound', { message: 'error' });

           }

           

        };


        vm.subjectProcedure = function()
        {

            

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


        





        vm.pushIndicator = function()
        {
           

                var proivdedAnswer = vm.returnFormattedAnswer(vm.questions[vm.questionIndex].answer);

                var Indicator = (proivdedAnswer == vm.questions[vm.questionIndex].stamp) ? 1 : 0;

                console.log('provided Answer :' + proivdedAnswer);

                console.log('correct answer :' +  vm.questions[vm.questionIndex].stamp);

                var activeLevel = vm.activeLevel              

                vm.stream.distribution[vm.currentSubjectIndex].PerformanceIndicator[activeLevel].push(Indicator);

                if(Indicator)
                {
                    console.log('correct response answer');
                }

                else {

                    console.log('incorrect response answer');

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

            /*  

            channel.addEventListener('message', event => {

            if(event.data.status == 1 && window.cachedRegisterSW != undefined)
            {
                 window.cachedRegisterSW.sync.register('exam');
            }

            });

            */

            navigator.serviceWorker.addEventListener('message', event => {

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

                    $scope.$emit('playSound', { message: 'quiz-end' });

                    vm.closeCurrentWindow();




                }, 

                function(res){

                  if(res.status < 1)
                  {

                    vm.idbPayload.data.quizMeta.endState = 'Network Lost';
                    vm.triggerBackgroundSync(vm.idbPayload);

                  }

                    vm.closeCurrentWindow();  

                    $scope.$emit('playSound', { message: 'quiz-end' });


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

                  $scope.$emit('playSound', { message: 'quiz-timeout' });

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
