(function() {

    angular.module('io2v3').controller('quizDlsCtrl', ['API_URL', '$scope', '$http', '$stateParams', 'quizPlayData', '$timeout', function(API_URL, $scope, $http, $stateParams, quizPlayData, $timeout){


        var vm = this;


        vm.quizData = quizPlayData.data;


        vm.levels = ['easy', 'medium', 'difficult'];

        vm.activeLevel = vm.levels[0];
        vm.questionIndex = 0;
        vm.currentSubjectIndex = 0;

        vm.quiz = vm.quizData.quiz;

        vm.endOfSubjects = false;

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


        vm.questions = [];


        vm.initializeQuestions = function()
        {

            var currentQuestions = vm.stream.collections[vm.currentSubjectName].composite[vm.activeLevel][0];
            vm.questions.push(currentQuestions);
            vm.stream.collections[vm.currentSubjectName].composite[vm.activeLevel].splice(0, 1);

            vm.mainNext = true;

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


        for (var i = 0;  i < vm.noSubjects; i++) {
            vm.stream.distribution[i].PerformanceIndicator = {

                easy : [],
                medium : [],
                difficult : []
            };
            
        }

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

                vm.markSubjectAnswered();

                vm.pushIndicator();

                vm.difficultyProcedure();
        
                vm.initializeQuestions();

                vm.questionIndex += 1;


                
                

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

                

                if(vm.stream.distribution[vm.currentSubjectIndex].subjectOverloaded && !vm.endOfSubjects)
                {
                    vm.subjectProcedure();
                }
           
                var levelAction = vm.levelSwitchCheckpoint(vm.switchFrequency);
                vm.difficultySwitcher(levelAction);

        };


        vm.difficultySwitcher = function(levelAction)
        {


            if(levelAction === 1)
            {
               
                // upgrade 


                if(vm.activeLevel == 'easy')
                {
                    

                    if(vm.stream.collections[vm.currentSubjectName].composite[vm.activeLevel].length != 0)
                    {
                       vm.activeLevel = 'medium';                          
                    }

                    else if (vm.stream.collections[vm.currentSubjectName].composite['difficult'].length != 0)
                    {
                     vm.activeLevel = 'difficult';
                    }

                    else if(vm.stream.collections[vm.currentSubjectName].composite['difficult'].length == 0 && vm.stream.collections[vm.currentSubjectName].composite['medium'].length == 0) {

                        vm.activeLevel == 'easy';

                    }

                    else {

                        console.log('action upgrade : cannot determine diffculty level from easy to highier');

                    }


                }

                else if (vm.activeLevel == 'medium')
                {                    
                   
                    if (vm.stream.collections[vm.currentSubjectName].composite['difficult'].length != 0)
                    {
                       vm.activeLevel == 'difficult';
                    }

                    else if (vm.stream.collections[vm.currentSubjectName].composite['medium'].length != 0)
                    {
                        
                        vm.activeLevel == 'medium';
                        console.log('diff updgrade: no questions in difficult so staying at medium');

                    }

                    else {

                        console.log('diff updgrade: med to diff : no questions reverting to easy');
                        vm.activeLevel == 'easy';

                    }

                }

                

            }

            else if (levelAction === -1)
            {

                // downgrade levels

                if(vm.activeLevel == 'difficult')
                {
                    
                    if (vm.stream.collections[vm.currentSubjectName].composite['medium'].length != 0)
                    {
                         vm.activeLevel = 'medium';

                         console.log('downgrade : difficult to med have questions');
                    }

                    else if (vm.stream.collections[vm.currentSubjectName].composite['easy'].length != 0)
                    {
                        
                        vm.activeLevel = 'easy';
                        console.log('downgrade : difficult to med no question revert to easy');

                    }

                    else {

                        vm.activeLevel = 'difficult';
                        console.log('downgrade : difficult to med no questions found staying at difficult');

                    }
                    


                }

                else if (vm.activeLevel == 'medium')
                {
                     
                    
                    if (vm.stream.collections[vm.currentSubjectName].composite['easy'].length != 0)
                    {
                        vm.activeLevel = 'easy';
                        console.log('downgrade : med to difficult, have questions changed to easy');
                    }


                }

                else 
                {
                    vm.activeLevel = 'easy';
                }

                
            }

            else if (levelAction === 0)
            {
               
                // no change in levels

                console.log('no change in difficulty level');

            }



        };


        vm.levelSwitchCheckpoint = function(frequency)
        {

            /*
                get the lenght of items in indicators 
            */  

            var activeLevel = vm.activeLevel;
            var indicatorLength = vm.stream.distribution[vm.currentSubjectIndex].PerformanceIndicator[activeLevel].length;  

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
                
            }



        };


        vm.pushIndicator = function()
        {

            
            if(vm.stream.distribution[vm.currentSubjectIndex].subjectOverloaded == undefined)
            {
                // continue with current subject
                var Indicator = (vm.questions[vm.questionIndex].answer == vm.questions[vm.questionIndex].stamp) ? 1 : 0;
                var activeLevel = vm.activeLevel              
                vm.stream.distribution[vm.currentSubjectIndex].PerformanceIndicator[activeLevel].push(Indicator);

                if(Indicator)
                {
                    console.log('correct answer');
                }

                else {

                    console.log('wrong answer');

                }

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



    }]);

})();
