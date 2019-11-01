(function() {

    angular.module('io2v3').controller('quepoolCtrl', ['API_URL', '$scope', '$http', function(API_URL, $scope, $http){


        var vm = this;

        $scope.$parent.dash.pageHeading = "Questions Stats";


        console.log('que pool is activated');


        var url = API_URL+'question-section-summary';


        $http.get(url, {cache: false}).then(function(res) {


        	vm.dataList = res.data.queSum;

        });

        


    }]);

})();
