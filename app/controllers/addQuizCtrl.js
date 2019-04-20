(function() {

    angular.module('io2v3').controller('addquizCtrl', ['API_URL', '$scope', '$http', '$state', '$timeout', function(API_URL, $scope, $http, $state, $timeout){


        var vm = this;
        vm.nquiz = {
            category_id : 'Select Category'
            

        };

        vm.desp;
        vm.subdesp;
        


        vm.resetDecipline = function()
        {
           
           vm.desp = [];
           vm.subdesp = [];         

           vm.nquiz.cleanDesp = [];
           vm.nquiz.cleanSubDesp = [];  
        };




        vm.isMatchSubCat = function(catId)
        {
    
            if(vm.nquiz.cleanDesp != undefined)
            {
                if(vm.nquiz.cleanDesp.indexOf(catId) != -1)
                {
                    return true;
                }
                return false;
            }

            else {
                return false;
            }

        }


        vm.cleanDesp = function(id)
        {

            
            
            var result = Object.keys(vm.desp).filter(function(x) { 
                 return vm.desp[x] !== false; 
            });

            vm.nquiz.cleanDesp = result; 
        }



        vm.cleanSubDesp = function()
        {
            
            var result = Object.keys(vm.subdesp).filter(function(x) { 
                 return vm.subdesp[x] !== false; 
            });

            vm.nquiz.cleanSubDesp = result; 
        }


        vm.fetchCategory = function()
        {

            var url = API_URL+'cat-tree';
            $http.get(url).then(function(res){
                vm.catList = res.data.tree;

            });

        };

        vm.fetchCategory();



        vm.saveQuiz = function()
        {

            var startDateTime = angular.element('#ddate').init()[0].value;
            var endDateTime = angular.element('#adate').init()[0].value;
            vm.nquiz.startDateTime = startDateTime;
            vm.nquiz.endDateTime = endDateTime;


            function saveSuccess(res)
            {
                console.log(res.data);

                var notify = {
                        type: 'success',
                        title: 'Operation Successfull',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };

                    $scope.$emit('notify', notify);

                 


                 var lastQuizId = res.data.last_id;

                 var allocateQuestionUrl = API_URL+'quiz-question-allocate/'+lastQuizId;

                 function allocateSuccess(res)
                {
                    
                     var notify = {
                        type: 'info',
                        title: 'Question Allocation',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };

                   vm.allocateInterval = $timeout(function() {

                    

                   }, 1000);     


                   $scope.$emit('notify', notify);

                   $timeout.cancel(vm.allocateInterval);

                   $state.go('dash.land');

                    
                   
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

            }

            function saveFailure(res)
            {

                console.log(res.data);

            }

            var url = API_URL+'quiz';


            nquiz.decipline = vm.cleanDesp();
            nquiz.subdecipline =  vm.cleanSubDesp();



            $http({

                url : url,
                method : 'POST',
                data : vm.nquiz

            }).then(saveSuccess, saveFailure);


        };



        vm.check = function()
        {

            console.log('updated');

        };


        
    }]);

})();
