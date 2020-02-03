(function() {

    angular.module('io2v3').controller('studentDashboardCtrl', ['API_URL', '$scope', '$http', '$stateParams', function(API_URL, $scope, $http, $stateParams){


        var vm = this;

        $scope.$parent.std.pageHeading = "Main";	

        console.log('protected console');


        setTimeout(function() {


        $(document).keydown(function (event) {

    		if (event.keyCode == 123 ||event.keyCode == 85) { 

        return false;

    		} else if (event.ctrlKey && event.shiftKey && event.keyCode == 73 || event.keyCode == 85) {         

        		return false;

    		}
		});



    $('body').bind('cut copy paste', function (e) {

    	console.log(e);

        e.preventDefault();
    });



        });

    




    }]);

})();



