(function() {

    angular.module('io2v3').controller('examOverviewCtrl', ['API_URL', '$scope', '$http', '$stateParams', 'quizDataService', function(API_URL, $scope, $http, $stateParams, quizDataService){


        var vm = this;

        vm.examID = $stateParams.examID;
        $scope.$parent.absExamId = $stateParams.examID;


        $scope.$parent.exAbs.pageHeading = "Overview Details";


        vm.loadProgress = null;




        quizDataService.getMasterQuiz(vm.examID).then(

	    	function(res){

	    		console.log(res);

	    		vm.Quiz = res.data.quiz[0];
	    		vm.Distro = res.data.quizBaseDistro;


	    	}, 

	    	function(res){

	    		console.log(res);
  	    		vm.loadProgress = false;

	        });


        vm.toggleEnroll = function(itemId, value)
        {


            console.log('fired');
            
            var enrolltoggleUrl = API_URL+'quiz-enrollment-toggle/'+itemId;



            $http({

                url : enrolltoggleUrl,
                method : 'PUT',
                data : {'enrollment' : value}

            }).then(successEnrollToggle, errorEnrollToggle);


            function successEnrollToggle(res)
            {
                

                var notify = {
                        type: 'success',
                        title: 'Enrollment',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);

            }

            function errorEnrollToggle(res)
            {
                
                var notify = {
                        type: 'error',
                        title: 'Enrollment',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);


                    vm.Quiz.enrollment = !res.data.value;




            }

        };



        vm.optionsToggle = function(typeKey, quizId, statusValue)
        {


            var optionToggleUrl = API_URL+'quiz-option-toggle/'+quizId;


            var dataPayload = {typeKey :  typeKey, statusValue :  statusValue};

            var successOptiontoggle = function(res)
            {

            };


            var errorOptiontoggle = function(res)
            {
                if(typeKey == 'dls')
                {
                    
                    vm.Quiz.dls = 0;

                    var notify = {
                        type: 'error',
                        title: 'DLS OPeration failed',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                }
            };

            
             $http({

                    url : optionToggleUrl,
                    method : 'PUT',
                    data : dataPayload

                }).then(successOptiontoggle, errorOptiontoggle);


        };



		
        

    }]);

})();
