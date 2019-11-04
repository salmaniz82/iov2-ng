(function() {

    angular.module('io2v3').controller('invitedAbstractCtrl', ['API_URL', '$scope', '$http', '$stateParams', '$state', function(API_URL, $scope, $http, $stateParams, $state){

        var vm = this;

        console.log('invited abstract is activated');


        vm.message = "hello world";

        vm.pageHeading = "Invitation"


        vm.brandLogo = 'assets/images/iSkillMetrics-logo.svg';
        


    }]);

})();
