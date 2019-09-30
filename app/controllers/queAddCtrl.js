(function() {

    angular.module('io2v3').controller('queAddCtrl', ['API_URL', '$scope', '$http', '$state', '$stateParams', 'quizDataService', 'queGlobalData', 'auth', function(API_URL, $scope, $http, $state, $stateParams, quizDataService, queGlobalData, auth){

        var vm = this;


        vm.showMediaLibrary = false;
        vm.mediaLoaded = null;

        vm.questionMedia = [];

        $scope.$parent.base.pageUrl = $state.current.url; 


        vm.bindTopCategory = true;







        console.log(queGlobalData);



        vm.userRole = auth.getUser()['role'];


        vm.isNumber = angular.isNumber;



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
           $scope.$parent.exAbs.pageHeading = "Add New Questions";
        }
        else {

            $scope.$parent.dash.pageHeading = "Add New Questions";

        }    


        

        vm.addMediaToQuestion = function(item)
        {

            if(!vm.mediaAddedTolist(item.id))
            {
                vm.questionMedia.push(item);    
            }

        };

        vm.mediaAddedTolist = function(itemid)
        {

            var idx = $scope.$parent.base.getIndex(vm.questionMedia, 'id', itemid);
            if(idx == -1)
            {
                return false;
            }

            return true;

        };


        vm.unlinkFromLibrary = function(itemId)
        {

            var idx = $scope.$parent.base.getIndex(vm.questionMedia, 'id', itemId);


            vm.questionMedia.splice(idx, 1);            

        };


        vm.enableLibrary = function()
        {
            vm.showMediaLibrary = true;            
        };


        vm.closeLibrary = function()
        {

            vm.showMediaLibrary = false;            

        };


        vm.removeMedia = function(index)
        {

            vm.questionMedia.splice(index, 1);


        };


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


        vm.saveReturn = false;
        vm.queLevel = "Select Level";
        vm.queType = "Select Type";

        


        vm.nque = {};


        vm.optAns = {
            a : false,
            b : false,
            c : false,
            d : false
        }



        vm.fetchGlobal = function()
        {

            vm.globalList = queGlobalData.data;
            

        };


        vm.saveQuestion = function(type = null)
        {

        	
        	if(type == 'more')
        	{
        		vm.saveReturn = true;
        	}
        	else {
        		vm.saveReturn = false;	
        	}


            if(vm.queType == 3)
            {


                console.log('condition matched');

                // build string for multiple choice
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


               console.log(vm.nque.answer);

            }


        	var url = API_URL+'questions';

        	vm.nque.category_id = vm.queCategory;
        	vm.nque.section_id = vm.queSection;
        	vm.nque.level_id = vm.queLevel;
        	vm.nque.type_id = vm.queType;


            

            if(vm.questionMedia.length > 0)
            {

                vm.nque.mediaIds = [];

                vm.questionMedia.forEach(function(item) {

                    vm.nque.mediaIds.push(item);

                });



            }

            if($stateParams.examID != undefined)
            {
                vm.nque.quiz_id =  $stateParams.examID;               
            }

        		


        	$http({

        		url : url,
        		method : 'POST',
        		data : vm.nque

        	}).then(saveSuccess, saveError);



        	function saveSuccess(res)
        	{
        		console.log(res);

        		 vm.nque = {};
                 vm.questionMedia = [];
        	}

        	function saveError(res)
        	{
        		console.log(res);
        	}


        }



        vm.fetchMedia = function()
        {

            $http.get(API_URL+'media').then(

                function(res) {

                    vm.mediaLoaded = true;

                    vm.mediaList = res.data.media;

                }, 
                function(res) {

                    vm.mediaLoaded = false;

                });

        };


        vm.fetchGlobal();
        vm.fetchMedia();


        


        vm.sendFile = function()
        {

            if($stateParams.examID != undefined)
            {
                vm.myFormData.category_id = vm.quizData.quiz[0].category_id;
            }
            else {

                vm.myFormData.category_id = vm.queCategory;

            }

            var file = $scope.photo;
            var uploadUrl = API_URL+'media';

            var form_data = new FormData();
            angular.forEach(file, function(file){
                form_data.append('file', file);
            });


            var formpostdata = vm.myFormData;

            for (var key in formpostdata) {
                form_data.append(key, formpostdata[key]);
            }

            $http.post(uploadUrl, form_data,
                {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined, 'Process-Data': false}
            }).then(
            function(res){

                var lastItem = res.data.lastItem[0];
                vm.mediaList.push(lastItem);

            }, 

            function(res){


                var notify = {
                        type: 'error',
                        title: 'Error',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                
            });

        };





    }]);

})();
