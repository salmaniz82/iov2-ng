(function() {

    angular.module('io2v3').controller('examOverviewCtrl', ['API_URL', '$scope', '$http', '$stateParams', function(API_URL, $scope, $http, $stateParams){


        var vm = this;

        vm.examID = $stateParams.examID;
        $scope.$parent.absExamId = $stateParams.examID;

        

    }]);

})();
