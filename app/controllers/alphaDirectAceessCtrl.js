(function() {

    angular.module('io2v3').controller('alphaDirectAceessCtrl', 

              ['API_URL', '$scope', '$http', '$stateParams', 'auth', '$state', 'SITE_URL', '$location', 
      function(API_URL, $scope, $http, $stateParams, auth, $state, SITE_URL, $location){


        var vm = this;


      	if($stateParams.alphaID != undefined)
      	{
      		vm.alphaID = $stateParams.alphaID;
      	}
      	



      	$http.get(API_URL+'quiz-direct-url/'+vm.alphaID).then(function(res){


		if(res.data.urltoken != undefined)
		{

			var data = res.data;

			vm.accesstoken = data.urltoken;
			vm.slug = data.slug;

			if(auth.isLoggedIn())
			{

				if(auth.getUser().role == 'students')
				{


					$state.go('inv.invited', {'entityslug': vm.slug, 'invitetoken': vm.accesstoken});

				}


			}

		}


      	}, function(res){



      	});	



      	vm.directAcesslogin = function()
      	{

      		var url = '/login?actiontoken='+vm.accesstoken;
      		console.log(url);



      		$location.url(url);



      	};



    }]);

})();
