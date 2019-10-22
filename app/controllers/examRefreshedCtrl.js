(function() {

    angular.module('io2v3').controller('examRefreshedCtrl', ['API_URL', '$scope', '$http', '$stateParams', function(API_URL, $scope, $http, $stateParams){


        var vm = this;


        vm.countdown = 0;


        	setTimeout(function($window) {


        		window.close();

        		

        	}, 3000);




    }]);

})();
