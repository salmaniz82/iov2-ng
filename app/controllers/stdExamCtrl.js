(function() {

    angular.module('io2v3').controller('stdExamCtrl', ['API_URL', '$scope', '$http', '$state', function(API_URL, $scope, $http, $state){


        var vm = this;
        vm.quizModal = false;
        vm.hasQuizEnrolled = null;
        vm.hasPendingQuiz = false;
        vm.hasAttemptedQuiz = false;
        vm.isInitiatStart = false;


        

        localStorage.removeItem('lastStoredDurationSeconds');



        vm.initiateQuiz = function(enroll_id)
        {
          
            vm.isInitiatStart = true;


            /*

            var popup = window.open("http://localhost:8000/quiz-assement/177/24", "myPopup", 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width=800,height=600')

            */

            $http({
                url : API_URL+'std-quiz-initiate',
                method : 'POST',
                data : {'enroll_id' : enroll_id}

            }).then(function(res){

                var attempt_id = res.data.attempt_id;

                var stateargs = {'attempt_id' : attempt_id, 'quiz_id': vm.actQuiz.id};

                console.log(stateargs);

                $state.go('quizPlay',stateargs);

            },
            function(res){

                console.log(res);

            });

        };

        



        vm.launchQuizModal = function(quizId, reattempt = false)
        {

        	

            if(!reattempt)
            {
                var idx = $scope.$parent.base.getIndex(vm.dataList.quiz, 'id', quizId);
                vm.actQuiz = vm.dataList.quiz[idx];    
            }
            else {
                var idx = $scope.$parent.base.getIndex(vm.dataList.attempted, 'id', quizId);
                vm.actQuiz = vm.dataList.attempted[idx];
            }

            vm.quizModal = true;
            
        };


        function successFetchQuizList(res)
        {
        	
        	if(res.data.quiz != 0)
        	{       		
                vm.hasQuizEnrolled = true;
                vm.hasPendingQuiz = true;

        	}

            if (res.data.attempted != 0)
            {
                vm.hasAttemptedQuiz = true;
                vm.hasQuizEnrolled = true;
            }

        	if (res.data.quiz == 0 && res.data.attempted == 0){

        		vm.hasQuizEnrolled = false;	

        	}

            vm.dataList = res.data;

        	

        }

        function errorFetchQuizList(res)
        {       	

            if(res.data.quiz == 0 && res.data.attempted == 0)
            {
                vm.hasQuizEnrolled = false;    
            }

        }


        var url = API_URL+'std-quiz-list';

        $http({

        	url : url,
        	method: 'GET'

        }).then(successFetchQuizList, errorFetchQuizList);



        



    }]);

})();
