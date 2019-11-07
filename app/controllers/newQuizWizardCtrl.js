(function() {

    angular.module('io2v3').controller('newQuizWizardCtrl', ['API_URL', '$scope', '$http', '$state', '$stateParams', 'wizardPreset', 'quizWizardService', function(API_URL, $scope, $http, $state, $stateParams, wizardPreset, quizWizardService){


        var vm = this;

        $scope.$parent.base.pageUrl = $state.current.url; 

        $scope.$parent.dash.pageHeading = "Add New Quiz";


        vm.parentId = null;
        vm.subCategory = null;
        vm.subjectIds = [];


        $scope.stage == 2;


        vm.PresetData = wizardPreset.data;

        vm.categories = vm.PresetData.categories;

        vm.poolSummary = vm.PresetData.pool;

        vm.nQuiz = {};

        vm.nQuiz.reTakeUnique = 0;

        vm.nQuiz.dls = 0;

        vm.nQuiz.scoreVisible = 0;

        vm.nQuiz.showGradings = 0;

        vm.nQuiz.showGPA = 0;
        
        vm.chosenSubjects = [];

        vm.allDone = false;


        vm.hasValidDistribution = false;



        vm.phaseOneStatus = 'inactive';    
        vm.phaseTwoStatus = 'inactive';
        vm.phaseThreeStatus = 'inactive';
        vm.phaseFourStatus = 'inactive';


        vm.navigateToLastCreated = function()
        {
            $state.go("exm.exam", { examID: vm.lastCreatedId });
        }


        vm.calcMaxAllocation = function(maxX)
        {

            vm.maxAllocated = parseInt(vm.nQuiz.noQues) * parseInt(maxX);

        };


        vm.saveQuiz = function(saveNature)
        {


              if(saveNature == 1)
              {
                vm.hasValidDistribution = true;
              }  

              else {
                vm.hasValidDistribution = false;
              }


            /*
                preparePayload
                checkpoints 
                -----------
                attempt to save quiz
                attempt to allocate questions
                attempt to update subjects distribution
            */


            vm.moveToStep(6);



            vm.phaseOneStatus = 'working';                 



            var newQuizPayload = {

                title : vm.nQuiz.title,
                category_id : vm.parentId,
                cleanDesp : [vm.subCategory],
                cleanSubDesp : vm.subjectIds,
                duration: vm.nQuiz.duration,
                maxScore: vm.nQuiz.maxScore,
                minScore: vm.nQuiz.minScore,
                startDateTime: vm.nQuiz.startDateTime,
                endDateTime: vm.nQuiz.endDateTime,
                noques: vm.nQuiz.noQues,
                code: vm.nQuiz.code,
                venue: vm.nQuiz.venue,

                threshold: vm.nQuiz.threshold,
                dls : vm.nQuiz.dls,
                uniqueOnRetake: vm.nQuiz.reTakeUnique,
                showScore: vm.nQuiz.scoreVisible,
                showResult: vm.nQuiz.showResults,
                showGrading: vm.nQuiz.showGradings,
                showGPA : vm.nQuiz.showGPA,
                maxAllocation: vm.nQuiz.maxAllocation
                
            
            };

            vm.phaseOneStatus = 'done';

            vm.phaseTwoStatus = 'working';  


            function saveWizardSuccess(res)
            {

                vm.phaseTwoStatus = 'done';

                var notify = {
                        type: 'success',
                        title: 'Operation Successful',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);


                   var lastId = res.data.last_id;

                   vm.lastCreatedId = lastId;    

                   /*

                   if distribution is not valid then we must exit 
                   distribution save 
                   and we must not go to the allocation 

                   */



                   if(vm.hasValidDistribution)
                   {
                      vm.phaseFourStatus = 'working';    
                      vm.saveDistribution(lastId);  
                   }
                   
                   else {

                        vm.allDone = true;

                   }    




            }


            function saveWizardError(res)
            {

                vm.phaseTwoStatus = 'error';

                var notify = {
                        type: 'error',
                        title: 'Save Operation Failed',
                        content: res.data.message,
                        timeout: 8000 //time in ms
                    };
                    $scope.$emit('notify', notify);

            }


            console.log(newQuizPayload);

              

            $http({
                url : API_URL+'quiz/wizard',
                method: 'POST',
                data: newQuizPayload


            }).then(saveWizardSuccess, saveWizardError);


        };


        vm.checkDates = function()
        {       

            
            var currentDateTime = new Date();

            currentDateTime.setMilliseconds(0);
            currentDateTime.setSeconds(0);

            var startDateTime = document.getElementById('startDateTime').value;
            var endDateTime = document.getElementById('endDateTime').value;

            vm.nQuiz.startDateTime =  startDateTime;   
            vm.nQuiz.endDateTime = endDateTime;

            vm.dateVerified = null;
            vm.datesError = null;

            var inputStartDateTime = new Date(startDateTime);

            inputStartDateTime.setMilliseconds(0);
            inputStartDateTime.setSeconds(0);

            var inputEndDateTime = new Date(endDateTime);

            inputEndDateTime.setMilliseconds(0);

            inputEndDateTime.setSeconds(0);


            if(inputStartDateTime < currentDateTime)
            {
                vm.datesError = 'start datetime cannot be less than current date time';
                vm.dateVerified = false;
            }


            else if(inputEndDateTime <= inputStartDateTime)
            {
                vm.datesError = 'End Date Time must be greater!';
                vm.dateVerified = false;
            }

            else {

                vm.dateVerified = true;
                vm.datesError =  null;
                
            }


            if(vm.dateVerified == true && vm.datesError == null)
            {
                vm.moveToStep(4);
            }



        };


        vm.toggleFeatures = function(featureName)
        {

        	(vm.nQuiz.featureName == 1) ? 0 : 1;       	
        	console.log('attempt to toogle retake' + vm.nQuiz.reTakeUnique);

        };


        vm.moveStage = function(currentStage, nextStage)
        {



        };


        console.log('new quiz wizard executed');


        vm.setParent = function(catId)
        {

        	vm.subCategory = null;
        	vm.parentId = catId;		
        	vm.availableInPool = 0;
            vm.chosenSubjects = [];

        };


        vm.setSubCategory = function(subCategory)
        {

        	
        	vm.subjectIds = [];
        	vm.subCategory = subCategory;
        	vm.availableInPool = 0;
            vm.chosenSubjects = [];

        };


        vm.toggleSelectSubjects = function(subjectId)
        {
        	var Idx = vm.subjectIds.indexOf(subjectId);	
        	if(Idx == -1)
        	{
        		vm.subjectIds.push(subjectId);
        	}
        	else {
        		vm.subjectIds.splice(Idx, 1);			
        	}

        	vm.setAvailableQuestions();

            vm.setChoosenSubjects();

        };

        vm.setAvailableQuestions = function()
        {

        	vm.availableInPool = 0;		
			   	
        	for(var key in vm.poolSummary)
        	{

        		 if (vm.poolSummary.hasOwnProperty(key)) {

        		 	var Idx = vm.subjectIds.indexOf(vm.poolSummary[key]['section_id']);	

        				 if(Idx != -1)
        				 {
        				 		vm.availableInPool += parseInt(vm.poolSummary[key]['noQues']);	     				 	
        				 }

    				}
        	}


        };


        vm.setChoosenSubjects = function()
        {


            vm.chosenSubjects = [];
             
            for(var key in vm.categories)
            {

                 if (vm.categories.hasOwnProperty(key)) {

                    var Idx = vm.subjectIds.indexOf(vm.categories[key]['id']);

                         if(Idx != -1)
                         {
                                
                                vm.chosenSubjects.push(vm.categories[key]);
                         }

                    }
            }


        };


        vm.isSubjectActive = function(subjectId)
        {

        	var Idx = vm.subjectIds.indexOf(subjectId);
        	if(Idx == -1)
        	{
        		return false;
        	}
        	return true;
        };

        vm.stepOneisValid = function()
        {

        	if(vm.subjectIds.length < 1)
        	{
        		return false;
        	}

        	return true;

        };

        vm.moveToStep = function(stepNo)
        {

            if(stepNo == 5)
            {
                vm.activateDistroState();
                $scope.stage = stepNo;
            }
            else {
                $scope.stage = stepNo;
            }


        };



        vm.activateDistroState = function()
        {


            if(vm.subjectIds.length == 0)
            {
                 var notify = {
                        type: 'error',
                        title: 'Categorization',
                        content: 'Select all 3 levels in category',
                        timeout: 8000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                    $scope.stage = 1;

                    return false;
            }


            var dataPayload = {

               threshold : vm.nQuiz.threshold,
               subject_ids : vm.subjectIds 

            };


            quizWizardService.loadPreDistributionInfo(dataPayload).then(

                function(res){

                    if(res.data.distro != undefined && res.data.distro.length != 0)
                    {


                        vm.preDistro = res.data.distro;

                        if($scope.stage != 5) 
                        {
                           $scope.stage = 5;     
                        }



                    }
                    else {
                       

                    }


                }, 

                function(res){

                    console.log('cannot move the state at this point');

                });




        };



        $scope.$watch('vm.nQuiz.entDateTime', function (newValue, oldValue, scope) {
               
            if(newValue != oldValue)
            {
                console.log('the value has been changed');
  
            }
            
        }, true);



        vm.detectChange = function()
        {

            console.log('change has beeen detected');

        };



        vm.getTotal =  function()
          {


            vm.Qtotal  = 0;
            vm.pointsTotal = 0;
            vm.subjecTotal = 0;

            for(var property  in vm.preDistro)
            {
                if(vm.preDistro.hasOwnProperty(property))
                {
                    
                    var item = vm.preDistro[property];

                    item.quePerSection = parseInt(item.quePerSection);
                    item.points = parseFloat(item.points);
                    item.questions = parseFloat(item.questions);

                    if(parseInt(item.quePerSection) == 'NaN')
                    {
                        item.quePerSection = 0;
                    }


                    if(parseFloat(item.points) == 'NaN')
                    {
                        item.points = 0;   
                    }

                    

                    if(parseFloat(item.questions) == 'NaN')
                    {
                        item.questions = 0;
                    }


                    vm.subjecTotal += parseFloat(item.questions);
                    vm.Qtotal += item.quePerSection;
                    vm.pointsTotal += parseFloat(item.points);

                }

            }

          }



          vm.saveDistribution = function(lastID)
          {

              var saveDistroUrl = API_URL+'quiz/distribution/'+lastID; 

              

              $http({

                url : saveDistroUrl,
                method : 'PUT',
                data : vm.preDistro

              }).then(
              function(res){

                vm.phaseFourStatus = 'done';

                vm.phaseThreeStatus = 'working';


                var allocateQuestionUrl = API_URL+'quiz-question-allocate/'+lastID;

                function allocateSuccess(res)
                {
                    
                     var notify = {
                        type: 'info',
                        title: 'Question Allocation',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };

                    $scope.$emit('notify', notify);
                    vm.phaseThreeStatus = 'done';

                    vm.allDone  = true;

                    
                }

                function allocateError(res)
                {

                     var notify = {
                        type: 'error',
                        title: 'Question Allocation',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };

                    $scope.$emit('notify', notify);

                }


                $http.post(allocateQuestionUrl).then(allocateSuccess, allocateError);

                

                var notify = {
                        type: 'info',
                        title: 'Distrbution',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };

                    $scope.$emit('notify', notify);

                 //   $state.go("exm.exam", { examID: lastID });


              }, 

              function(res){
              
                vm.phaseFourStatus = 'error';

                var notify = {
                        type: 'error',
                        title: 'Distrbution',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };

                    $scope.$emit('notify', notify);

              });
     
          }

    }]);

})();
