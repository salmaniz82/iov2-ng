(function() {

    angular.module('io2v3').controller('quizProgressCtrl', ['API_URL', '$scope', '$http', '$stateParams', function(API_URL, $scope, $http, $stateParams){


        var vm = this;
        vm.examID = $stateParams.examID;
        $scope.$parent.absExamId = vm.examID;

        
        vm.loadStatus = null;

        $scope.$parent.exAbs.pageHeading = "Progress Details";


        vm.activeId = false;



        vm.enableScoreCard = false;
        vm.scoreLoading = null;
        vm.dualColumnEnabled = false;


        vm.enabledScoreUpdateId = false;



        vm.answerEnabled = false;

        vm.answerLoading = null;


        vm.dataList = null;


        vm.loadPrimaryData = function()
        {


             var progressUrl = API_URL+'quiz/progress/'+vm.examID;

             $http.get(progressUrl).then(

            function(res){
                
                vm.loadStatus = true;
                vm.dataList = res.data;

            }, 

            function(res){

                vm.loadStatus = false;              

            });

        };


        vm.loadPrimaryData();



          vm.activateScoreCard = function(attempt_id)
          {



             // deactivate ansswers

            vm.answerEnabled = false;
            vm.activeId = false;
            vm.answerLoading = null;   

            vm.answerDataList = null;





            vm.enableScoreCard = true;

            vm.scoreLoading = null;

            vm.activeId = attempt_id;

            vm.examID;    

            var scoreCardUrl = API_URL+'quiz/scorecard/'+vm.examID+'/'+attempt_id;

            vm.dualColumnEnabled = true;

            $http.get(scoreCardUrl).then(
            
            function(res){
               
                

                vm.scoreLoading = true;
                vm.scoreCard = res.data;

            }, 


            function(res){


              vm.scoreLoading = false;      


            });



          };

          vm.disableScoreCard = function()
          {

            vm.enableScoreCard = false;                
            vm.activeId = false;
            vm.scoreCard = false;
            vm.dualColumnEnabled = false;

          };


          vm.activateAnswers = function(attempt_id)
          {

            vm.enableScoreCard = false;
            vm.scoreCard = false;

            vm.dualColumnEnabled = true;


            vm.answerEnabled = true;


            vm.answerLoading = null;

            vm.answerDataList = null;


            vm.activeId = attempt_id;
            vm.examID;    


            var answerUrl = API_URL+'quiz/inspectanswers/'+vm.examID+'/'+attempt_id;


            $http.get(answerUrl).then(

            function(res){

                console.log(res);

                vm.answerDataList = res.data;
                
                vm.answerLoading = true;


            }, 

            function(res){
                
                vm.answerLoading = false;



            });



            vm.markPayload = [];

            vm.checkForDuplicates = function(sourceCollections, incommingData)
                {

                    var answerId = incommingData.id;
                    var typeIncoming = incommingData.type;



                    for(key in sourceCollections)
                    {

                        if(sourceCollections[key].id == answerId && sourceCollections[key].type == typeIncoming)
                        {
                            return 1;
                        }

                        else if(sourceCollections[key].id == answerId && sourceCollections[key].type != typeIncoming){

                            return 2;
                        }

                    }

                    return 0;

                };

            
            

            vm.markForUpdates = function(type, answerId, questionId)
            {


                var answerListIndex = $scope.$parent.base.getIndex(vm.answerDataList.answers, 'answerId', answerId);
                var currentPayload = {'attempt_id': vm.activeId, 'id' : answerId, que_id : questionId, type : type};

                if(vm.markPayload.length == 0)
                {
                    vm.markPayload.push(currentPayload);              
                    vm.answerDataList.answers[answerListIndex]['markedStatus'] = type;
                    
                }

                else if(vm.checkForDuplicates(vm.markPayload, currentPayload) == 0)
                {
                    vm.markPayload.push(currentPayload);
                    vm.answerDataList.answers[answerListIndex]['markedStatus'] = type;
                }

                else if (vm.checkForDuplicates(vm.markPayload, currentPayload) == 1)
                {
                    
                    var idx = $scope.$parent.base.getIndex(vm.markPayload, 'id', answerId);
                    vm.markPayload.splice(idx, 1); 
                    vm.answerDataList.answers[answerListIndex]['markedStatus'] = null;
                    
                }

                else if(vm.checkForDuplicates(vm.markPayload, currentPayload) == 2)
                {
                    
                    var idx = $scope.$parent.base.getIndex(vm.markPayload, 'id', answerId);   
                    vm.markPayload[idx] = currentPayload;
                    vm.answerDataList.answers[answerListIndex]['markedStatus'] = type;
                    
                }

            };

          };




          vm.processMarkedAnswers = function()
          {


            vm.activeId;

            var processUrl = API_URL+'markandudpateanswers/'+vm.activeId;




            $http({

                url : processUrl,
                method: 'POST',
                data : {'dataMarkedPayload': vm.markPayload}

            }).then(

            function(res){

                console.log('this is the success call');

                vm.activeId = false;
                vm.enableScoreCard = false;                        
                vm.scoreCard = false;
                vm.dualColumnEnabled = false;
                vm.markPayload = [];


                vm.answerEnabled = false;
                vm.answerLoading = null;
                vm.dataList = null;

                vm.enabledScoreUpdateId = false;


                vm.loadPrimaryData();



            }, 

            function(res){


                console.log('the error call');


            });





          };



          vm.deactivateAnswers = function()
          {


            vm.dualColumnEnabled = false;
            vm.answerEnabled = false;
            vm.activeId = false;


            vm.answerLoading = null;



          };


         vm.enableScoreMatrix = function(attemptId)
        {
            vm.enabledScoreUpdateId  = attemptId;
        };


        vm.deactivateMarkUpdateMode = function()
        {
            vm.enabledScoreUpdateId  = false;
            vm.markPayload = [];

        };



          vm.attemptRecover = function(attempt_id)
          {




            var recoveryUrl = API_URL+'quiz/progress/recoverviaactivity/'+attempt_id;
            var idx = $scope.$parent.base.getIndex(vm.dataList.attempted, 'attemptId', attempt_id);

            

            $http.put(recoveryUrl).then(

            function(res){

                

                vm.dataList.attempted[idx] = res.data.progress[0];


            }, 

            function(res){
                
                var notify = {
                        type: 'error',
                        title: 'Recovery Failed',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);


            });





          };



    }]);

})();
