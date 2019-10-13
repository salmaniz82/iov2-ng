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



        vm.answerEnabled = false;

        vm.answerLoading = null;


        vm.dataList = null;

        var progressUrl = API_URL+'quiz/progress/'+vm.examID;

        $http.get(progressUrl).then(

        	function(res){
                
        		vm.loadStatus = true;
                vm.dataList = res.data;

        	}, 

        	function(res){

        		vm.loadStatus = false;      		

        	});



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




            


          };



          vm.deactivateAnswers = function()
          {


            vm.dualColumnEnabled = false;
            vm.answerEnabled = false;
            vm.activeId = false;


            vm.answerLoading = null;



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
