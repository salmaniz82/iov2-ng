(function() {

    angular.module('io2v3').controller('questionEditCtrl', ['API_URL', '$scope', '$http', '$stateParams', '$state', function(API_URL, $scope, $http, $stateParams, $state){

        var vm = this;

        vm.nque = {};

        

        $scope.$parent.base.pageUrl = $state.current.url; 

        $scope.$parent.dash.pageHeading = "Edit Question";

        vm.questionID = $stateParams.queID;

        vm.pageloading == null

        vm.queData = null;





        $http.get(API_URL+'question/'+vm.questionID).then(

        	function(res){

        		vm.pageloading = true;

        		vm.queData = res.data;

        		vm.selectedAnswer = vm.queData.question.answer;


                if(vm.queData.question.type_id == 3)
                {
                    vm.initCheckbox();

                }
        		
        	}, 

        	function(res){

        		vm.pageloading = false;

        	});



        vm.initCheckbox = function()
        {


            vm.optAns = {};

                    vm.optAns.a = false;
                    vm.optAns.b = false;
                    vm.optAns.c = false;
                    vm.optAns.d = false;

                     var ansOptArray = vm.queData.question.answer.split(',');
                     

                     for(key in vm.optAns)
                     {

                        if(vm.optAns.hasOwnProperty(key))
                        {

                            if(ansOptArray.indexOf(key) != -1)
                            {
                                vm.optAns[key] = true;
                            }

                            
                        }

                       

                     }

        };


        vm.prepareCheckboxString = function()
        {

            var tempArrOPtions = [];

                for(var key in vm.optAns)
                {
                    if(vm.optAns.hasOwnProperty(key))
                    {
                        if(vm.optAns[key] == true)
                        {
                            tempArrOPtions.push(key);
                        }
                    }
                }

               vm.nque.answer = tempArrOPtions.join(",");

        };


        vm.preparePayload = function()
        {

             payload = {

                queDesc : vm.queData.question.queDesc,
                type_id : vm.queData.question.type_id
                
            };


            if(vm.queData.question.type_id != 4)
            {

                payload.optionA = vm.queData.question.optionA;
                payload.optionB = vm.queData.question.optionB;
                if(vm.queData.question.type_id != 2)
                {
                    payload.optionC = vm.queData.question.optionC;
                    payload.optionD = vm.queData.question.optionD;    
                }               

            }


            if(vm.queData.question.type_id == 1 || vm.queData.question.type_id == 2)
            {
                /*
                radion and boolean
                */

                payload.answer = vm.selectedAnswer;
            }
            else if(vm.queData.question.type_id == 4) {

                payload.answer =  vm.queData.question.answer;  
                
            }

            else {

                payload.answer =  vm.nque.answer;  

            }



            vm.payload = payload;



        };


        vm.triggerUpdate = function(res)
        {
            
            if(vm.queData.question.type_id == 3)
            {
                vm.prepareCheckboxString();
            }

            vm.preparePayload();


            vm.pushChanges();


        };


        vm.pushChanges = function()
        {


            var updateError = function(res)
            {

                var notify = {
                        type: 'error',
                        title: 'Operation Failed',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };

                    $scope.$emit('notify', notify);

            };


            var updateSuccess = function(res)
            {

                var notify = {
                        type: 'success',
                        title: 'Operation Success',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };

                    $scope.$emit('notify', notify);


                    $state.go('dash.questions');


            };


            $http({

                url : API_URL+'question/'+vm.questionID,
                method : 'PUT',
                data : vm.payload

            }).then(updateSuccess, updateError);



        };




    }]);

})();
