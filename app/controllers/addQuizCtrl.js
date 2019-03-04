(function() {

    angular.module('io2v3').controller('addquizCtrl', ['API_URL', '$scope', '$http', '$state', function(API_URL, $scope, $http, $state){


        var vm = this;
        vm.nquiz = {
            category_id : 'Select Category'
        };

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
                        type: 'success',
                        title: 'Question Allocation',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };

                    $scope.$emit('notify', notify);

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


        console.log('add Quiz Ctrl');
        


    }]);

})();
