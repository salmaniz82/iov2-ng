(function() {

    angular.module('io2v3').controller('batchesCtrl', ['API_URL', '$scope', '$http', '$state', function(API_URL, $scope, $http, $state){


        var vm = this;

        $scope.$parent.base.pageUrl = $state.current.url; 

        $scope.$parent.dash.pageHeading = "Batches";

        

        vm.revealQuizList = false;

        vm.loadingStatus = null;

        vm.showProgress = false;

        vm.revealCandProgress = false;


        vm.showEnrollment = false;

        vm.showBatchDetails = false;



        vm.getEligQuiz = function()
        {
            
            


            function getEligQuizSuccess(res)
            {
                vm.eligQuiz = res.data.eligQuiz;

                vm.revealQuizList = true;

                
            }

            function getEligQuizError(res)
            {


                var notify = {
                                type: 'error',
                                title: 'Error While Fetching Eligible Quiz',
                                content: res.data.message,
                                timeout: 5000 //time in ms
                            };
                            $scope.$emit('notify', notify);  

                vm.revealQuizList = false;

            }

            $http.get(API_URL+'batches/elig/quiz').then(getEligQuizSuccess, getEligQuizError);

        };


        vm.enrollProcess = function()
        {

            console.log(vm.nbt.email);


            vm.activeBatchId;

            $http({

                url : API_URL+'batches/enrollprocess/'+vm.activeBatchId,
                method: 'POST',
                data: {email: vm.nbt.email}

            }).then(


            function(res)
            {

                vm.nbt.email = "";


                if(vm.enrollCanidateList == undefined)
                {
                    vm.enrollCanidateList = res.data.lastCandiate;
                    vm.enrollContents = true;    
                }

                else {

                    vm.enrollCanidateList.push(res.data.lastCandiate[0]);

                }


                var notify = {
                                type: 'success',
                                title: 'Batch Enrollment',
                                content: res.data.message,
                                timeout: 8000 //time in ms
                            };
                            $scope.$emit('notify', notify);

                


            },


            function(res)
            {
                      var notify = {
                                type: 'error',
                                title: 'Failed Batch Enrollment',
                                content: res.data.message,
                                timeout: 8000 //time in ms
                            };
                            $scope.$emit('notify', notify);              

            });

        };


        vm.triggerEnroll = function(batch_id)
        {

            


            vm.showProgress = false;      
            vm.showEnrollment = false;
            vm.showBatchDetails  = false;
            vm.revealCandProgress = false;

            vm.activeBatchId = batch_id;



            $http.get(API_URL+'batches/tagged/canidates/'+batch_id).then(

            function(res) {


                vm.showEnrollment = true;


                if(res.status == 206)
                {
                    vm.enrollContents = false;
                }

                else if (res.status == 200)
                {
                    
                    vm.enrollContents = true;

                    vm.enrollCanidateList = res.data.candidates;

                    
                }




            }, function(res) {

            });

            /*

            1. make ajax get the list of student enrolled by batch_id
            2. show input box for new enrollment
            3. show errors 
            4. show new student enrolled
            5. show close button

            */

        };


        vm.closeCandProgress = function()
        {
            
            

            vm.revealCandProgress = false;
            vm.progressData = vm.lastBatchProgress;
            vm.showProgress = true;    


        }

        vm.nb = {};

        vm.batchQuizList = [];


        $http({
            url : API_URL+'batches',
        	method: 'GET',
        	cache: false
        })
        .then(function(res){

        		vm.dataList = res.data;
                vm.loadingStatus = true;

        }, function(res){

            vm.loadingStatus = false;
          

        });


        vm.enableQuizSelect = function()
        {          

            vm.getEligQuiz();
            
                
        }


        vm.addtoBatch = function(quizId)
        {

            var idx = $scope.$parent.base.getIndex(vm.eligQuiz, 'id', quizId);
            var targetItem = vm.eligQuiz[idx];
            vm.batchQuizList.push(targetItem);
            vm.calcMinMax();

        /*
        get the index of the item copy from that index and push that to the added list array
        */

        };


        vm.unlinkQuizFromBatch = function(quizId)
        {

            var idx = $scope.$parent.base.getIndex(vm.batchQuizList, 'id', quizId);
            vm.batchQuizList.splice(idx, 1); 
            vm.calcMinMax();

        };


        vm.hasItemAdded = function(quizId)
        {

            var idx = $scope.$parent.base.getIndex(vm.batchQuizList, 'id', quizId);

            if(idx == -1)
            {
                return false;
            }

            return true;

        };


        vm.calcMinMax = function()
        {

            var max = 0;
            var min = 0;

            for(var key in vm.batchQuizList)
                {
                    if(vm.batchQuizList.hasOwnProperty(key))
                    {

                       max += parseInt(vm.batchQuizList[key].maxScore);
                       min += parseInt(vm.batchQuizList[key].minScore);

                    }
                }

                vm.nb.minScore = min;
                vm.nb.maxScore = max;

        };



        vm.addBatchProcess = function()
        {


            /*
                what I need
                object containng the master details
                array of quizId that are in the batch
            */

            function sanitzieQuizIds()
            {

                var quizIds = [];

                for(var key in vm.batchQuizList)
                {
                    if(vm.batchQuizList.hasOwnProperty(key))
                    {

                       quizIds.push(vm.batchQuizList[key].id);
                       
                    }
                }

                return quizIds;

            }

            var newBatch = {

                title: vm.nb.title,
                maxScore : vm.nb.maxScore,
                passingScore: vm.nb.minScore,
                quizIds : sanitzieQuizIds()

            };

            console.log(newBatch);



            $http({

                method: 'POST',
                url : API_URL+'batches',
                data: newBatch 

            }).then(

                function(res)
                {
                    
                    vm.revealQuizList = false;
                    vm.addBatch = false;

                    vm.nb = {};

                    vm.batchQuizList = [];

                    vm.nb.minScore = 0;
                    vm.nb.maxScore = 0;

                    

                    


                    if(vm.dataList == undefined)
                    {
                        vm.loadingStatus = true;

                        vm.dataList = {};

                        vm.dataList.batches = res.data.lastBatch;

                    }
                    else {


                        vm.dataList.batches.push(res.data.lastBatch[0]);

                    }



                }, 

                function(res)
                {
                    console.log(res);

                });

        };



        vm.activateProgress = function(itemId)
        {

            vm.activeBatchId = itemId;

            vm.addBatch = false;


            $http.get(API_URL+'batches/'+itemId).then(
            
            function(res){

                

                vm.progressData = res.data.batchProgress;


                  vm.showProgress = true;      
                  vm.showEnrollment = false;
                  vm.showBatchDetails  = false;
                  



    
            }, 

            function(res){




            });    


        };



        vm.closeProgress = function()
        {
            vm.showProgress = false;
            vm.progressData = null;

            vm.activeBatchId = null;
        };


        vm.closeEnroll = function()
        {
          
            vm.showEnrollment = false;

            /*    
            vm.activeBatchId = null;
            */

        }


        vm.activateCanidateProgress = function(candiateId)
        {


            

            /*
                
                store current batchh progress for later back functionality 
                so we don't need to make another ajax request to the server
                make another ajax to the server to get the student progress
                then acitvate another view and hide this one
            */
            vm.lastBatchProgress = vm.progressData;

            $http.get(API_URL+'batches/candidate/overview/'+vm.activeBatchId+'/'+candiateId).then(

                function(res){

                  vm.candProgress =  res.data.batchCanidateOverview;

                  vm.candSummary = res.data.summary;     


                  vm.showProgress = false;      
                  vm.showEnrollment = false;
                  vm.showBatchDetails  = false;

                  
                  
                  vm.revealCandProgress = true;



                    





                }, 

                function(res){


                });

        };

        


        vm.activateDetails = function(batchId)
        {
         


            vm.activeBatchId = batchId;

            $http.get(API_URL+'batch/details/'+batchId).then(


                function(res){

                    vm.batchMasterDetails = res.data;
                    


                    vm.showProgress = false;
                    vm.revealCandProgress = false;
                    vm.showEnrollment = false;


                    vm.showBatchDetails  = true;


                    vm.proceedToX = false;

                }, 

                function(res){

                    var notify = {
                                type: 'error',
                                title: 'Not Found',
                                content: res.data.message,
                                timeout: 5000 //time in ms
                            };
                            
                            $scope.$emit('notify', notify);

                            vm.closeBatchDetails();



                });


        };

        


        vm.closeBatchDetails = function()
        {
            /*
            vm.activeBatchId = null;
            */
            vm.showBatchDetails  = false;
            vm.proceedToX = false;

        };


    }]);

})();
