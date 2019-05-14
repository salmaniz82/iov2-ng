(function() {

    angular.module('io2v3').controller('newQuizWizardCtrl', ['API_URL', '$scope', '$http', '$stateParams', 'wizardPreset', function(API_URL, $scope, $http, $stateParams, wizardPreset){


        var vm = this;


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
        
        vm.chosenSubjects = [];


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

			$scope.stage = stepNo;	        		

        };

        


    }]);

})();
