(function() {

    angular.module('io2v3').controller('dashProfileCtrl', ['API_URL', '$scope', '$http', '$stateParams', '$state', function(API_URL, $scope, $http, $stateParams, $state){


        var vm = this;


        vm.token = localStorage.getItem('auth_token');


        vm.slugValidity = null;

        


        $scope.$parent.base.pageUrl = $state.current.url; 
        $scope.$parent.dash.pageHeading = "Profile";


        vm.uploadUrl = API_URL+'profile/logo';

        $scope.dropzoneConfig = {
            'options': { 
              'url': vm.uploadUrl,
              'multiple' : false,
              'maxFiles' : 1,
              'thumbnailWidth': null,
              'thumbnailHeight': null,
              
              'acceptedFiles': ".pdf,.png,.jpg,.gif,.bmp,.jpeg",
              'dictDefaultMessage': 'Drag or upload logo image here',
              headers: {"token": vm.token}
            },
            'eventHandlers': {
              'sending': function (file, xhr, formData) {

                console.log(xhr);

              },
              'success': function (file, response) {

                  console.log('file is sent');


              }
            }
        };

        

        vm.loadingStatus = null;


        vm.profileData = false;


        vm.slugify = function(string) {
          const a = 'àáäâãåăæąçćčđďèéěėëêęǵḧìíïîįłḿǹńňñòóöôœøṕŕřßśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;'
          const b = 'aaaaaaaaacccddeeeeeeeghiiiiilmnnnnooooooprrssssttuuuuuuuuuwxyyzzz------'
          const p = new RegExp(a.split('').join('|'), 'g')

          return string.toString().toLowerCase()
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
            .replace(/&/g, '-and-') // Replace & with 'and'
            .replace(/[^\w\-]+/g, '') // Remove all non-word characters
            .replace(/\-\-+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, '') // Trim - from end of text
        }



        vm.sayHello  = function(brandTtext)
        {


        		slug = vm.slugify(brandTtext);
	        	vm.profileData.slug = slug;	
                vm.slugAvailable(slug);

        };



        vm.getProfile = function()
        {


        	var profileUrl = API_URL+'profile';

        	$http.get(profileUrl).then(

        		function(res) {

        			if(res.data.status == true)
        			{
        				
        				vm.loadingStatus = true;
        				vm.profileData = res.data.profile[0];

                        vm.logoUrl = API_URL+vm.profileData.logo;


        			}

        			else {

        				vm.loadingStatus = false;

        			}


        		}, 

        		function(res){

        			vm.loadingStatus = false;

        		})

        };



        vm.getProfile();


        vm.saveProfile = function()
        {
        	

             $http({

                url : API_URL+'profile',
                method : 'POST',
                data : vm.profileData
            }).then(

            function(res) {

            }, 

            function(res){

            })


        };



        vm.updateProfile = function()
        {


            
            $http({

                url : API_URL+'profile',
                method : 'PUT',
                data : vm.profileData
            }).then(

            function(res) {

            }, 

            function(res){

            })

        };



        vm.slugAvailable = function(slug)
        {

            


            var successSlugCheck = function(res, status, xhr)
            {
                vm.slugValidity = true;
            };

            var errorSlugCheck = function(res, status, xhr)
            {



                if(res.status == 406)
                {

                    vm.slugValidity = false;

                    
                    
                    vm.slugValidity = false;

                    var notify = {
                        type: 'error',
                        title: 'Critical Error',
                        content: res.responseJSON.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                }

            };

            var slugurl = API_URL+'profile/slugavailable';


            $.ajax({

                url : slugurl,
                method : 'POST',    
                data:  {'slug': slug}

            }).then(successSlugCheck, errorSlugCheck);



        };



    }]);

})();
