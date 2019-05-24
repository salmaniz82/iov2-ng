(function() {

    angular.module('io2v3').controller('questionsCtrl', ['API_URL', '$scope', '$http', '$stateParams', '$window', '$state', function(API_URL, $scope, $http, $stateParams, $window, $state){


        var vm = this;

        console.log('master questions controller is activated');



        vm.loading = null;


        $http.get(API_URL+'questions').then(

        	function(res) {

        		vm.loading = true;

        		vm.dataList = res.data;

        		vm.questions = vm.dataList.questions;

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
