(function() {

    angular.module('io2v3').controller('questionPreviewCtrl', ['API_URL', '$scope', '$http', '$stateParams', function(API_URL, $scope, $http, $stateParams){


        var vm = this;


        $scope.baseUrl = API_URL;



        vm.entityLogo = function()
        {

        	return API_URL+'assets/images/iSkillMetrics-logo.png';

        };

        
        vm.questionId = $stateParams.questionId;


        $http.get(API_URL+'question/'+vm.questionId).then(

        	function(res) {



        		vm.activeQuestion = res.data.question;



        	}, 

        	function(res) {

        	});



        vm.optionhasImage = function(optionsSTring)
        {

            myRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg))/i
            return myRegex.test(optionsSTring);
        };




        vm.launchLightbox = function(imgPath, imgCaption)
        {

            vm.lightBoxEnabled = true;

            console.log(imgPath);

            vm.fullImageSourceLink = imgPath;
            
            vm.fullImageTitle = imgCaption;

        };


        vm.closeLightBox = function()
        {

            vm.lightBoxEnabled = false;

        };




    }]);

})();
