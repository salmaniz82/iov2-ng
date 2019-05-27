(function() {

    angular.module('io2v3').controller('dashQuizzesCtrl', ['API_URL', '$scope', '$http', '$state', function(API_URL, $scope, $http, $state){


        var vm = this;


        vm.loadingStatus = null;

        $scope.$parent.base.pageUrl = $state.current.url; 




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


            


        };

        
        

        


    }]);

})();
