(function() {

    angular.module('io2v3').controller('enrollCtrl', ['API_URL', '$scope', '$http', '$stateParams', function(API_URL, $scope, $http, $stateParams){


        var vm = this;

        vm.examID = $stateParams.examID;

        $scope.$parent.absExamId = vm.examID;

        var enrollUrl = API_URL+'enroll/'+vm.examID;


        $scope.$parent.exAbs.pageHeading = "Enrollment";

        vm.interceptModal = false;


        vm.nenroll = {};


        vm.dataList;


        vm.sendInvitation = function(itemId)
        {

            console.log(itemId);

            var inviteUrl = API_URL+'sendinvitation/'+itemId;

            var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', itemId);

            vm.dataList[idx].invited = 1;


            $http({

                url : inviteUrl,
                method : 'POST',
                data : {}
            }).then(

            function(res){


                var notify = {
                        type: 'info',
                        title: 'Invitation',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    
                    $scope.$emit('notify', notify);

            }, 
            function(res){


                var notify = {
                        type: 'error',
                        title: 'Invitation Failed',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

            });



        }



        function successEnroll(res)
        {
            
            if(res.data.status == true)
            {
                vm.dataList = res.data.enroll;
            }

        }

        function errorEnroll(res)
        {

            console.log(res);

            vm.dataList = false;
        }


        $http.get(enrollUrl).then(successEnroll, errorEnroll);


        vm.quizEnroll = function()
        {
            var newEnrollUrl = API_URL+'enroll';

            vm.nenroll.quiz_id = vm.examID;


            function successEnrollSave(res)
            {

              if(vm.dataList == undefined || vm.dataList == false)
              {
                    
                    vm.dataList = res.data.lastEnroll;     
              }

              else {

                vm.dataList.push(res.data.lastEnroll[0]);
              }

              vm.nenroll = {};

            }

            function errorEnrollSave(res)
            {
                var notify = {
                        type: 'error',
                        title: 'Enrollment Error',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);
            }

            $http({

            url : newEnrollUrl,
            method : 'POST',
            data : vm.nenroll
            }).then(successEnrollSave, errorEnrollSave);

        };



        vm.toggleRetake = function(itemId)
        {

            var Idx = parseInt($scope.$parent.base.getIndex(vm.dataList, 'id', itemId));
            var retake = vm.dataList[Idx].retake;

            $http({
                url : API_URL+'enroll/retake/'+itemId,
                method : 'PUT',
                data : {retake : retake}
            }).then(
                
                function(res)
                {

                    
                    var notifyType = (res.data.value == 1) ? "success" : "warning";



                    var notify = {
                        type: notifyType,
                        title: 'Operation Successfull',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                }, 

                function(res){

                    vm.dataList[Idx].retake = (vm.dataList[Idx].retake == 1)  ? "0" : "1";

                    var notify = {
                        type: 'error',
                        title: 'Operation Failed',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                })



        };


        vm.updateScheduleDateTime = function(itemId, quizid, scheduleDateTime)
        {


            var Idx = parseInt($scope.$parent.base.getIndex(vm.dataList, 'id', itemId));
            
            var mewDatetime = document.getElementById('adate'+itemId).value;
            
            
            $http({

                url : API_URL+'enroll/schedule-datetime/'+itemId+'/'+quizid,
                method : 'PUT',
                data : {dtsScheduled: mewDatetime}

            }).then(
            function(res){



                var notify = {
                        type: 'success',
                        title: 'Reschedule Success',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                

            }, 

            function(res){


                    var notify = {
                        type: 'error',
                        title: 'Reschedule Failed',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                

            });


        };


        vm.removeEnroll = function(itemId)
        {

            
            

            var removeSuccess = function(res)
            {

                var notify = {
                        type: 'success',
                        title: 'Operation Successfull',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);


                var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', itemId);

                
                vm.dataList.splice(idx, 1);
            

            };


            var removeError = function(res)
            {


                var notify = {
                        type: 'error',
                        title: 'Operation Failed',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);

            };


            $http.delete(API_URL+'enroll/'+itemId).then(removeSuccess, removeError);



        };



        

        vm.resetEnroll = function(itemid)
        {


            var resetSuccess = function(res)
            {

                var notify = {
                        type: 'success',
                        title: 'Operation Successfull',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);

            };


            var resetError = function(res)
            {

                var notify = {
                        type: 'error',
                        title: 'Operation Failed',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);

            };



            $http({
                url : API_URL+'enroll-reset/'+itemid,
                method : 'PUT',
                data : {'payload' : 'empty'}
            }).then(resetSuccess, resetError); 


        };


        vm.activateIntercept = function(itemId)
        {          

            var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', itemId);
            vm.interceptItem =  vm.dataList[idx];
            vm.interceptModal = true;

        };


        vm.deactivateintercept = function()
        {

            vm.interceptItem = null;
            vm.interceptModal = false;

        };


        vm.udpateIntercept = function(enrollId)
        {

            vm.updatePayload = {

                intercept: vm.interceptItem.intercept,
                direction: vm.interceptItem.direction,
                lastLimit : vm.interceptItem.lastLimit

            };

            var successIntercept = function(res) 
            {

                var notify = {
                        type: 'info',
                        title: 'Operation Successfull',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    
                    $scope.$emit('notify', notify);

                    vm.deactivateintercept();


            };

            var errorIntercept = function(res)
            {

                var notify = {
                        type: 'error',
                        title: 'Operation Failed',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    
                    $scope.$emit('notify', notify);


            };

        
            $http({

                url : API_URL+'intercept/'+enrollId+'/'+vm.interceptItem.quiz_id,
                method: 'PUT',
                data : vm.updatePayload

            }).then(successIntercept, errorIntercept);    

        };






    }]);

})();
