(function() {

    angular.module('io2v3').controller('quizcomplitedCtrl', ['API_URL', '$scope', '$http', '$stateParams', function(API_URL, $scope, $http, $stateParams){


        var vm = this;



        console.log('quizcomplitedCtrl: activated');



        vm.attemptClose = function()
        {

        	var win = window.open("about:blank", "_self");


        	setTimeout(function(){

        		win.close();

        	}, 300);

            open(location, '_self').close();    
			

        };



    }]);

})();
