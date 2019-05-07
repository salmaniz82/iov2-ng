(function() {

    angular.module('io2v3').controller('quizQuestionsCtrl', ['API_URL', '$scope', '$http', '$stateParams', function(API_URL, $scope, $http, $stateParams){


        var vm = this;


        vm.enableAllocate = false;


        vm.enableSynchronize = false;

        

        vm.examID = $stateParams.examID;
        $scope.$parent.absExamId = $stateParams.examID;
        var Questionsurl = API_URL+'quiz-questions/'+vm.examID;



        vm.toggleqqStatus = function(itemId, qqStatus, subject_id)
        {



            var idx = $scope.$parent.base.getIndex(vm.dataList.questions, 'id', itemId);

            var row = vm.dataList.questions[idx];


            console.log(row);

            
            var qqStatusToggleUrl = API_URL+'quiz-question-status-toggle/'+vm.examID+'/'+subject_id;

            $http({

                url : qqStatusToggleUrl,
                method: 'PUT',
                data : {status: qqStatus, qqId: itemId}

            }).then(

                function(res) {


                }, function(res){

                    var notify = {
                        type: 'error',
                        title: 'Weight Distributon Violation : ' + res.data.subject,
                        content: res.data.message,
                        timeout: 8000 //time in ms
                    };
                    $scope.$emit('notify', notify);


                    row.qqStatus = (res.data.toggleRequest) ? "0" : "1";


            });



        };



        vm.fetchQuestionList = function()
        {

        	function successFetchQuestions(res)
	        {
	        	
	        	vm.dataList = res.data;
	        	vm.enableAllocate = false;

                if(vm.dataList.questions.length > 0 && vm.dataList.questions != undefined)
                {
                    vm.syncCheck();
                }


                var expiredQuestion =  parseInt(vm.dataList.threshold.expired);
                var quizThreshold = parseInt(vm.dataList.threshold.threshold);

                $scope.threshold = quizThreshold;
                $scope.Globalthreshold = parseInt(vm.dataList.globalThreshold);
                $scope.gThresholdCount =  parseInt(vm.dataList.gThresholdCount);


                if(expiredQuestion > 0)
                {

                    var notify = {
                    type: 'warning',
                    title: 'Threshold Limit',
                    content: 'Quiz threshold of ' + quizThreshold + ' reached by ' + expiredQuestion + ' questions, disable and use lower limit',
                    timeout: 16000 //time in ms
                };
            
                 $scope.$emit('notify', notify);

                }


                if($scope.gThresholdCount > 0)
                {

                    var notify = {
                    type: 'error',
                    title: 'Global Threshold Limit',
                    content: 'Global threshold of ' + $scope.Globalthreshold + ' reached by ' + $scope.gThresholdCount + ' questions, disable and use lower limit',
                    timeout: 16000 //time in ms
                };
            
                 $scope.$emit('notify', notify);          

                }

	        }

	        function errorFetchQuestion(res)
	        {
	        	

	        	vm.enableAllocate = true;
	        }

	        $http.get(Questionsurl).then(successFetchQuestions, errorFetchQuestion);

        };



        vm.allocateQuestions = function()
        {

        	var allocateQuestionUrl = API_URL+'quiz-question-allocate/'+vm.examID;

        	function allocateSuccess(res)
        	{
        		
    			 var notify = {
                    type: 'success',
                    title: 'Question Allocated',
                    content: res.data.message,
                    timeout: 5000 //time in ms
                };
    		

        		 $scope.$emit('notify', notify);

        		vm.fetchQuestionList();

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


        };


        vm.syncCheck = function()
        {

            var synCheckUrl = API_URL+'newquestion-available/'+vm.examID;


            $http.get(synCheckUrl).then(function(res){

                console.log(res);

                if(res.data.noQues != 0)
                {
                    
                    vm.enableSynchronize = true;


                    vm.syncPayload = {

                        "quiz_id" : vm.examID,
                        "queIDs" : res.data.queIDs
                    }


                     var notify = {
                    type: 'info',
                    title: 'Synchronize Alert',
                    content: res.data.message,
                    timeout: 5000 //time in ms
                    };
            
                 $scope.$emit('notify', notify);

                }

            });


        };


        vm.fetchQuestionList();


        vm.processDoSyncronize = function()
        {

            var doSynUrl = API_URL+'quiz-question-sycnronize';

            $http({

                url : doSynUrl,
                method : 'POST',
                data : vm.syncPayload
            }).then(syncSuccess, syncError);



            function syncSuccess(res)
            {
                console.log(res.data);

                if(res.data.newQuestions != undefined)
                {

                    for(var i=0; i <= res.data.newQuestions.length-1; i++)
                    {
                        vm.dataList.questions.push(res.data.newQuestions[i]);
                    }

                    vm.enableSynchronize = false;

                      var notify = {
                    type: 'success',
                    title: 'Synchronize Status',
                    content: res.data.message,
                    timeout: 5000 //time in ms
                    };
            
                     $scope.$emit('notify', notify);

                }
            }

            function syncError(res)
            {
                console.log(res.data);
            }

        };



    }]);

})();
