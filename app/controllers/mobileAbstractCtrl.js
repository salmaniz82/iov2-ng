(function() {

    angular.module('io2v3').controller('mobileAbstractCtrl', ['API_URL', '$scope', '$http', '$stateParams', function(API_URL, $scope, $http, $stateParams){


        var vm = this;

        console.log('mobileAbstractCtrl activated')

        vm.slideMenuActive = false;




        vm.toggleSlideMenu = function()
        {

        	vm.slideMenuActive = !vm.slideMenuActive;

        };



        


    }]);

})();
