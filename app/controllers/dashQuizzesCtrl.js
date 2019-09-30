(function() {

    angular.module('io2v3').controller('dashQuizzesCtrl', ['API_URL', '$scope', '$http', '$state', function(API_URL, $scope, $http, $state){


        var vm = this;


        vm.loadingStatus = null;

        $scope.$parent.base.pageUrl = $state.current.url; 



        $scope.$parent.dash.pageHeading = "Quizzes";


        vm.updateDateTimeModal = false;


        vm.deleteConfirmModal = false;




        vm.fetchQuiz = function()
        {

        	var url = API_URL+'quiz';

        	function success(res)
        	{
        		
                vm.dataList = res.data.quiz;
                vm.loadingStatus = true;    


        	}

        	function error(res)
        	{

        		vm.dataList = res.data.quiz;
                vm.loadingStatus = false;

        	}

        	$http({

        		url : url,
        		method : 'GET'

        	}).then(success, error);

        };


        vm.fetchQuiz();

        

        vm.toggleEnroll = function(itemId, value)
        {


            console.log('fired');
            
            var enrolltoggleUrl = API_URL+'quiz-enrollment-toggle/'+itemId;


            var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', itemId);

            var row = vm.dataList[idx];


            $http({

                url : enrolltoggleUrl,
                method : 'PUT',
                data : {'enrollment' : value}

            }).then(successEnrollToggle, errorEnrollToggle);


            function successEnrollToggle(res)
            {
                console.log(res);

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


                    row.enrollment = !res.data.value;

            }

        };


        vm.statusToggle = function(itemId, value)
        {


            var statusToggleUrl = API_URL+'quiz-status-toggle/'+itemId;

            var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', itemId);

            var row = vm.dataList[idx];


            $http({

                url : statusToggleUrl,
                method : 'PUT',
                data : {'status' : value}

            }).then(toggleSuccess, toggleError);


            function toggleSuccess(res)
            {


                var notifyType = (res.data.qstatus == 1) ? 'success' : 'warning';

                console.log('type'  + res.data.qstatus);


                var notify = {
                        type: notifyType,
                        title: 'Status',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);               

            }

            function toggleError(res)
            {



            }
            


        };



        vm.launchDateTimeModal = function(itemId)
        {


            var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', itemId);
            vm.dateTimeModalData = vm.dataList[idx];


    

            /*
                get the object of the quiz by id
           */


            vm.updateDateTimeModal = true;

        };

        vm.closeDateTimeModal = function()
        {

          vm.dateTimeModalData = null;
          vm.updateDateTimeModal = false;



        };


        vm.udpateQuizdateTime = function()
        {

            var itemId = vm.dateTimeModalData.id;

            var newStartDate = document.getElementById('adate'+vm.dateTimeModalData.id).value;           
            var newEndDate = document.getElementById('edate'+vm.dateTimeModalData.id).value;
            
            /*
            vm.dateTimeModalData.startDateTime = newStartDate;
            vm.dateTimeModalData.endDateTime = newEndDate;
            */


            var dateRangeCheck = vm.checkDates(newStartDate, newEndDate);

            if(dateRangeCheck.status == true)
            {
                
                
                console.log('procceed');


                


                $http({

                    url : API_URL+'quiz-update-datetime/'+itemId,
                    method : 'PUT',
                    data : {
                        startDateTime: newStartDate,
                        endDateTime : newEndDate
                    }

                }).then(
                    function(res){


                        vm.dateTimeModalData.startDateTime = newStartDate;
                        vm.dateTimeModalData.endDateTime = newEndDate;




                        vm.closeDateTimeModal();


                        var notify = {
                        type: 'success',
                        title: 'Operation Successful',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                        $scope.$emit('notify', notify);   

                    },


                    function(res){


                        var notify = {
                        type: 'error',
                        title: 'Operation Failed',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);   



                    });




            }

            else {

                var notify = {
                        type: 'error',
                        title: 'Invalid Date Range',
                        content: dateRangeCheck.error,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);     

            }




        };



        vm.checkDates = function(startDateTime, endDateTime)
        {       

            
            var currentDateTime = new Date().toJSON().slice(0, 19).replace('T', ' ');
            vm.dateVerified = null;
            vm.datesError = null;

            
            if(endDateTime <= startDateTime)
            {
                
                return {    
                    status : false,
                    error : 'End datetime must be greater than start datetime'
                }

            }

            else {

                return {    
                    status : true,
                    error : null
                }

                
            }



        };



        vm.launchDeleteConfirmation = function(itemId)
        {

            
            var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', itemId);
            vm.deleteModalItem = vm.dataList[idx];

            vm.deleteConfirmModal = true;

            console.log(itemId);

        };


        vm.dissmissDeleteModal = function()
        {

            vm.deleteModalItem = null;

            vm.deleteConfirmModal = false;
        };


        vm.removeQuiz = function()
        {


            var id = vm.deleteModalItem.id;


            var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', id);

            var Quiztitle = vm.deleteModalItem.title;



            $http.delete(API_URL+'quiz/'+id).then(

                function(res) {


                    vm.dissmissDeleteModal();

                    vm.dataList.splice(idx, 1);


                    var notify = {
                        type: 'success',
                        title: 'Operation Successful',
                        content: Quiztitle+' '+res.data.message,
                        timeout: 5000 //time in ms
                    };

                    $scope.$emit('notify', notify);  



                }, 

                function(res) {


                    var notify = {
                        type: 'error',
                        title: 'Operation Failed',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);  

            });



        };

        
        

        


    }]);

})();
