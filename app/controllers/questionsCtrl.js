(function() {

    angular.module('io2v3').controller('questionsCtrl', ['API_URL', '$scope', '$http', '$stateParams', '$window', '$state', 'SITE_URL', function(API_URL, $scope, $http, $stateParams, $window, $state, SITE_URL){


        var vm = this;


        vm.togglers = false;


        $scope.sortType = '$';
        vm.searchQuery = '';
        $scope.sortReverse  = false;



        vm.selectSortfield = function(fieldName)
        {

            $scope.sortType = fieldName;

        };



        vm.launchQuestionPreviewWindow = function(questionId)
        {

            var popupUrl = SITE_URL+'questionpreview/'+questionId;


            console.log(popupUrl);

            

            window.quizWindow = window.open(popupUrl, "Question Preview", 

                'toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=0,resizable=0,fullscreen=yes,width='+screen.availWidth+',height='+
                   screen.availHeight 
                    );

                    


                    


        };


        vm.clearFilters = function()
        {

            $scope.sortType = '$';
            vm.searchQuery = '';
            $scope.sortReverse  = false;

        };

        vm.toggleSort = function()
        {

            $scope.sortReverse = !$scope.sortReverse;

        };


        

        

        $scope.$parent.base.pageUrl = $state.current.url; 

        $scope.$parent.dash.pageHeading = "Questions";




        $scope.fields = [

        {'cat': false},
        {'decip': false},
        {'author': false},
        {'dated': false},
        {'desc': true},
        {'answer': false},
        {'diff': false},
        {'type': false},
        {'hits': false},
        {'scope': true},
        
        {'description': false},
        {'hits': false},
        {'status': true}
        ];


        


        vm.toggleFields = function(field, index)
        {

          $scope.fields[index].field  =! $scope.fields[index].field;


          console.log($scope.fields[index].field);

        };


        vm.questionStatusToggle = function(id, queStatus)
        {

            console.log(id, queStatus);

            var toggleUrl = API_URL+'questions/status-toggle/'+id;


            var toggleUpdateSuccess = function(res)
            {


                  var notifyType = (queStatus == 1) ? 'success' : 'warning';

                var notify = {
                        type: notifyType,
                        title: 'Status Updated',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

            };


            var toggleUpdateError = function(res)
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

               url : toggleUrl,
               method : 'PUT',
               data : {'status': queStatus}

            }).then(toggleUpdateSuccess, toggleUpdateError);



        };



        vm.loading = null;


        $http.get(API_URL+'questions', {cache: false}).then(

        	function(res) {

                if(res.status == 200)
                {
                    vm.loading = true;
                    vm.dataList = res.data;
                    vm.questions = vm.dataList.questions;
                }

        		

                if(res.status == 204)
                {
                    vm.loading = 'no contents';
                }

        	},

        	function(res)
        	{

        		vm.loading = false;

        	});


        var onScrollAction = function (e) {

        	if($state.current.name == 'dash.questions')
        	{
        		
        		var currentScrollPosition = e.currentTarget.scrollTop;
        		var scrollHeight = (e.currentTarget.scrollHeight - (screen.height - 161) );

        		if(currentScrollPosition >= (scrollHeight - 300 ) )
        		{
        			console.log('load more triggered');
        		}

        		console.log(currentScrollPosition + ' : ' + scrollHeight);

        		/*
				
				Total Height of a div : scrollHeight: 9127
				--------------------- : 
        		scrollHeight: 9127
				scrollLeft: 0
				scrollTop: 400
				scrollWidth: 1258

        		*/


        	}



  				
			};


        

        $('.scrollable.wrapper').on('scroll', onScrollAction);

        //$('.scrollable.wrapper').off('scroll', onScrollAction);
		
        


    }]);

})();
