(function() {

    angular.module('io2v3').controller('questionsCtrl', ['API_URL', '$scope', '$http', '$stateParams', '$window', '$state', function(API_URL, $scope, $http, $stateParams, $window, $state){


        var vm = this;


        vm.togglers = false;

        

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
        {'status': false}
        ];


        vm.toggleFields = function(field, index)
        {

          $scope.fields[index].field  =! $scope.fields[index].field;


          console.log($scope.fields[index].field);

        };



        vm.loading = null;


        $http.get(API_URL+'questions').then(

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
        			console.log('load more buddy');
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
