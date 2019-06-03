(function() {

    angular.module('io2v3').controller('examMgmtAbstractCtrl', ['API_URL', '$scope', '$http', '$stateParams', function(API_URL, $scope, $http, $stateParams){


        var vm = this;
        $scope.absExamId = null;
        $scope.masterQuizData = null;


        $scope.pageHeading = "";


    }]);

})();
