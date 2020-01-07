(function() {

    angular.module('io2v3').controller('questionUploadCtrl', ['API_URL', '$scope', '$http', '$state', '$stateParams', 'quizDataService', 'queGlobalData', 'auth', function(API_URL, $scope, $http, $state, $stateParams, quizDataService, queGlobalData, auth){

        var vm = this;

        vm.isNumber = angular.isNumber;

        vm.userRole = auth.getUser()['role'];


        $scope.$parent.base.pageUrl = $state.current.url; 


        if($stateParams.examID == undefined)
        {
           $scope.$parent.dash.pageHeading = "Upload Questions";
        }
        else {

            $scope.$parent.exAbs.pageHeading = "Upload Quiz Questions";

        }


        vm.bindTopCategory = true;

        vm.myFormData = {};


                if(vm.userRole == 'content developer' || vm.userRole == 'contributor')
        {

            vm.bindTopCategory = true;

            if(queGlobalData.data.topCategory == false)
            {

                var notify = {
                        type: 'error',
                        title: 'Permission Denied',
                        content: 'Top level category was not assinged ',
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                $state.go('dash.questions');

                return false;

            }

            else {

                vm.topBindCategory = queGlobalData.data.topCategory;

                setTimeout(function() {

                    
                    vm.queCategory = vm.topBindCategory;

                    console.log();
                    
                    var idx = $scope.$parent.base.getIndex(vm.globalList.cat, "id", vm.queCategory.toString());

                    vm.topPreSelectCategory = vm.globalList.cat[idx]['tree'];



                })    
                

            }

        }

        else {


            vm.bindTopCategory = false;

        }



        if($stateParams.examID != undefined)
        {

            vm.QuizPrivate = true;
            

            vm.examID = $stateParams.examID;
            $scope.$parent.absExamId = $stateParams.examID;


            quizDataService.getMasterQuiz(vm.examID).then(function(res) {

                vm.quizData = res.data;
                vm.queCategory = vm.quizData.quiz[0].category_id;


            });

            vm.queSection = "Select Section";


        }

        else {
            vm.QuizPrivate = false;

            vm.queCategory = "Select Category";
            vm.queSection = "Select Section";
            vm.queDecipline = "Sub Descipline"

        }



        vm.fetchGlobal = function()
        {

            vm.globalList = queGlobalData.data;
            

        };



        vm.fetchGlobal();

        vm.sendUploadRequest = function()
        {

            
            var file = $scope.photo;


            if(file == undefined)
            {


                var notify = {
                        type: 'error',
                        title: 'Validation Error',
                        content: 'Please attach CSV file',
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                    return false;

            }


            var uploadUrl = API_URL+'questions-bulk';



            vm.myFormData.category_id = vm.queCategory;
            vm.myFormData.section_id = vm.queSection;

            vm.myFormData.type_id = vm.queType;

            vm.myFormData.level_id = vm.queLevel;

            

            console.log(vm.myFormData);
            

            var form_data = new FormData();
            angular.forEach(file, function(file){
                form_data.append('file', file);

                console.log(file);


            });

            var formpostdata = vm.myFormData;

            for (var key in formpostdata) {
                form_data.append(key, formpostdata[key]);
            }


            var successQuestionUpload = function(res)
            {

                var notify = {
                        type: 'success',
                        title: 'Operation Successfull',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                    $state.go('dash.questions');

            };

            var errroQuestionUpload = function(res)
            {

                var notify = {
                        type: 'error',
                        title: 'Operation Failed',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

            };



            $http.post(uploadUrl, form_data,
                {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined, 'Process-Data': false}
            }).then(successQuestionUpload, errroQuestionUpload);
        


        };



    }]);

})();
