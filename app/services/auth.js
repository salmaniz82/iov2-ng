angular.module('io2v3')
	.service('auth', ['$http', 'API_URL', '$cacheFactory', function($http, API_URL, $cacheFactory) {

		self = this;

		this.login = function(creds)
		{

			var loginUrl = API_URL+'login';
			
			return $http.post(loginUrl, {'email': creds.email, 'password': creds.password});
		};

		

		this.logout = function()
		{

			localStorage.removeItem('auth_token');
            localStorage.removeItem('hdauEn');

		};

		this.getUser = function()
		{
			if(this.hastokenAndUser())
			{
                var user = localStorage.getItem('hdauEn');
                user = atob(user);
                return  user = JSON.parse(user);
			}
		};

		this.hastokenAndUser = function()
		{
			if(localStorage.hasOwnProperty('auth_token') && localStorage.hasOwnProperty('hdauEn'))
			{
				return true;
			}
			else {
				return false;
			}
		};


		this.isLoggedIn = function()
		{
			if(localStorage.getItem('auth_token'))
			{
				return true;
			}
			else 
			{
				return false;
			}
		};


		


		this.userHasPermission = function(requiredPermission)
		{


				if(!self.isLoggedIn()){
	            		return false;
	        	}

	        	var userPermissions = self.getUser()['permissions'];
        		var found = false;


        		angular.forEach(userPermissions, function(permission, index){

            		if (requiredPermission.indexOf(permission) >= 0){

            			console.log(permission);
                		found = true;
                		return;
            		}                        
        });
         
        return found;

		};



		var cachedUrl = [
		'https://api.iskillmetrics.com/quiz',
		'https://api.iskillmetrics.com/questions',
		'https://api.iskillmetrics.com/question-section-summary',
		'https://api.iskillmetrics.com/batches',
		'https://api.iskillmetrics.com/roles',
		'https://api.iskillmetrics.com/users',
		'https://api.iskillmetrics.com/permissions',
		'https://api.iskillmetrics.com/role-permissions',
		'https://api.iskillmetrics.com/cats',
		'https://api.iskillmetrics.com/media'
		];


		this.clearAllhttpCache = function()
		{

			
			var $httpDefaultCache = $cacheFactory.get('$http');


			for(key in cachedUrl)
			{
				$httpDefaultCache.remove(cachedUrl[key]);

				
			}


			return true;



		};



		this.secureProtectUI = function()
        {


            setTimeout(function() {


            document.addEventListener('contextmenu', event => event.preventDefault());


        $(document).keydown(function (event) {

            if (event.keyCode == 123 ||event.keyCode == 85) { 

        return false;

            } else if (event.ctrlKey && event.shiftKey && event.keyCode == 73 || event.keyCode == 85) {         

                return false;

            }
        });



         $('body').bind('cut copy', function (e) {
         	
                    e.preventDefault();
                    return false;

        });

        });

        };

		
	}]);