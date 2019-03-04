(function() {

    angular.module('io2v3').controller('queAddCtrl', ['API_URL', '$scope', '$http', '$state', '$stateParams', function(API_URL, $scope, $http, $state, $stateParams){

        var vm = this;


        if($stateParams.examID != undefined)
        {

        }


        vm.saveReturn = false;

        vm.queCategory = "Select Category";
        vm.queLevel = "Select Level";
        vm.queSection = "Select Section";
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

        	var url = API_URL+'quiz-global';

        	function success(res)
        	{
        		
                vm.globalList = res.data;
        	}

        	function error(res)
        	{

        		console.log('unable to load the global values');

        	}

        	$http({

        		url : url,
        		method : 'GET'

        	}).then(success, error);

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

            if($stateParams.examID != undefined)
            {
                vm.nque.quiz_id =  $stateParams.examID;               
            }


        		console.log(vm.nque);


        	$http({

        		url : url,
        		method : 'POST',
        		data : vm.nque

        	}).then(saveSuccess, saveError);



        	function saveSuccess(res)
        	{
        		console.log(res);

        		 vm.nque = {};
        	}

        	function saveError(res)
        	{
        		console.log(res);
        	}


        }


        vm.fetchGlobal();

    }]);

})();
