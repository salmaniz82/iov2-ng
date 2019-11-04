(function() {

    angular.module('io2v3').controller('invitedbyentityCtrl', ['API_URL', '$scope', '$http', '$stateParams', '$state', function(API_URL, $scope, $http, $stateParams, $state){

        var vm = this;
        vm.entityProfileStatus = null;



        /*


        http://localhost:8000/login?actiontoken=eyJhY3Rpb24iOiJxdWl6SW52aXRhdGlvbiIsImVudGl0eVNsdWciOiJ2aXJ0dWFsLXRlY2giLCJlbnJvbGxfaWQiOjMyOSwiZW50aXR5X2lkIjozMywiY2FuZGlkYXRlX2lkIjo0NH0%3D

        */

        
        


        if($stateParams.entityslug == undefined || $stateParams.entityslug == null || $stateParams.entityslug == "")
        {


        		// return throw it out;

        }

        vm.entityslug = $stateParams.entityslug;



        /*
        	get entity by slug
        */

        var encodedString = 'eyJ0eXBlIjoicXVpekludml0YXRpb24iLCJsYW5kaW5nVXJsIjoiXC9pXC92aXJ0dWFsLXRlY2giLCJlbnJvbGxfaWQiOjMyOSwiaW52aXRhdGlvbklEIjozM30%3D';

       	

        var decodedUriObj = $scope.$parent.base.decodeUrlToken(encodedString);


        console.log(decodedUriObj);



        vm.fetchEntityProfile = function()
        {

        	var profileUrl = API_URL+'profile/entity-by-slug/'+vm.entityslug;

        	$http.get(profileUrl).then(

        		function(res) {

        			vm.entityProfileStatus = true;

                    vm.profileData = res.data.profile[0];

                    var logo = vm.profileData.logo;
                    var logoUrl = API_URL+'/'+logo;

                  
                    $scope.$parent.vm.brandLogo = logoUrl;

                    

        		}).then(function(res) {

        		/*
				
				throw it out because entity profile did not matched;				

        		*/		

        		vm.entityProfileStatus = false;

        		});



        };	


        vm.fetchEntityProfile();






    }]);

})();
