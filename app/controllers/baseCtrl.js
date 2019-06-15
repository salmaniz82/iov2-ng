(function(){
	angular.module('io2v3')
	.controller('baseCtrl', function($scope, auth, langSer, API_URL, $state){





        

		var vm = this;


        


        vm.branding = "IO2 Version 3";

		$scope.baseUrl = API_URL;

		//$scope.lang = 'en';

        $scope.lang = langSer.init();


		$scope.gval = {

                "exams": ['Exams', 'الامتحانات'],
                "about" : ['About', 'حول'],
                "terms" : ['Terms', 'شروط'],
                "privacy" : ['Privacy Policy', 'سياسة خاصة'],
                

                'details': ['Details', 'تفاصيل'],



                'status': ['Status', 'الحالة'],
                'available' : ['Available', 'متوفر'],

                'options': ['Actions', 'خيارات'],
                'details': ['Details', 'تفاصيل'],
                

                'addnew': ['Add New', 'اضف جديد'],
                'update': ['Update', 'تحديث'],
                'save': ['Save', 'حفظ'],
                'cancel': ['Cancel', 'حذف'],
                'edit': ['Edit', 'تصحيح'],
                'remove': ['Remove', 'حذف'],

                'back': ['Back', 'الى الخلف'],

                'profile': ['Profile', 'الملف الشخصي'],
                'setting': ['Setting', 'ضبط'],
                'logout': ['Logout', 'الخروج']

        };



		vm.isLoggedIn = function()
		{
			return auth.isLoggedIn();	
		};

		$scope.getAuthUsername = function()
		{
                return vm.authUser().name;
		};

        $scope.isAdmin = function()
        {
          
            if(auth.isLoggedIn())
            {
                return (vm.authUser().role_id == 1) ? true : false;
                
            }
            else {

                return false;

            }

            
        };


		vm.authUser = function()
		{

            if(this.hastokenAndUser())
            {
                var user = localStorage.getItem('hdauEn');
                user = atob(user);
                return  user = JSON.parse(user);
            }

		};

        vm.hastokenAndUser = function()
        {
            if(localStorage.hasOwnProperty('auth_token') && localStorage.hasOwnProperty('hdauEn'))
            {
                return true;
            }
            else {
                return false;
            }
        };



		$scope.langLabel = function()
		{
			if($scope.lang == 'en')
			{
				return 'English';
			}
			else {
				return 'Arabic';
			}
		};


        vm.getIndex = function(array, attr, value) {
            for(var i = 0; i < array.length; i += 1) {
                if(array[i][attr] === value) {
                    return i;
                }
            }
            return -1;
        };

		


		$scope.switchLang = function()
        {

            $scope.lang = langSer.switchLang();

        };

        $scope.authUser = vm.authUser();

        $scope.langIndex = function()
        {
            if($scope.lang == 'en')
            {
                return 0;
            }
            else {
                return 1;
            }
        };

        /*
            return decoded string
            usage from controller : $scope.$parent.base.decodeData(encodedString);
        */


        vm.inboundDecode = function(string)
        {          
            return JSON.parse(decodeURIComponent(atob(string)));

        };


        /*
            return encoded string to send to server
            usage from controller : $scope.$parent.base.encodeData(encodedString);
        */


        vm.outboundEncode = function(string) 
        {

            return encodeURIComponent(window.btoa(string));

        };


        $scope.getUSerRole  = function()
        {

            return vm.authUser().role;

        };

        

    });





})();