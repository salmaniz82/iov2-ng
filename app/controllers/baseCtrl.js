(function(){
	angular.module('io2v3')
	.controller('baseCtrl', ['$scope', 'auth', 'langSer', 'API_URL', '$state', '$http', function($scope, auth, langSer, API_URL, $state, $http){

		var vm = this;


        vm.branding = "IO2 Version 3";

		$scope.baseUrl = API_URL;


        $scope.masterData = null;

		//$scope.lang = 'en';

        $scope.lang = langSer.init();


        $scope.soundObject = null;


        $scope.isPlaying = false;


        $scope.entityLogo = 'assets/images/demo-logo.jpg';




        $scope.soundWavListCollection = [

        API_URL+'assets/audio/notify-success.wav',
        API_URL+'assets/audio/notify-error.wav',
        API_URL+'assets/audio/notify-info.wav',
        API_URL+'assets/audio/notify-warning.wav',
        API_URL+'assets/audio/quiz-next.wav',
        API_URL+'assets/audio/quiz-prev.wav',
        API_URL+'assets/audio/quiz-timeout.wav',
        API_URL+'assets/audio/quiz-end.wav',
        API_URL+'assets/audio/modal-open.wav',

        ];



        $scope.soundWavListCollection.forEach(function(soundLinkUrl) {

          console.log(soundLinkUrl);


        });



        $scope.$on('playSound', function (event, args) {

             $scope.message = args.message;

             var audioUrl = null;

             if($scope.isPlaying === true)
             {
                console.log('stop previous audio'); 
                $scope.soundObject.pause();
                $scope.soundObject.currentTime = 0;
             }

             
             if($scope.message === 'success')
             {

                audioUrl= API_URL+"assets/audio/notify-success.wav";
                $scope.soundObject = new Audio();
                $scope.soundObject.src = audioUrl;


             } 
             else if ($scope.message === 'error')
             {
                audioUrl= API_URL+"assets/audio/notify-error.wav";
                $scope.soundObject = new Audio();
                $scope.soundObject.src = audioUrl;
             }

             else if ($scope.message === 'warning')
             {
                audioUrl= API_URL+"assets/audio/notify-warning.wav";
                $scope.soundObject = new Audio();
                $scope.soundObject.src = audioUrl;
             }

             else if ($scope.message === 'info')
             {
                audioUrl= API_URL+"assets/audio/notify-info.wav";
                $scope.soundObject = new Audio();
                $scope.soundObject.src = audioUrl;
             }

             else if ($scope.message === 'modal-open')
             {
                audioUrl= API_URL+"assets/audio/modal-open.wav";
                $scope.soundObject = new Audio();
                $scope.soundObject.src = audioUrl;
             }

             else if ($scope.message === 'quiz-next')
             {
                audioUrl= API_URL+"assets/audio/quiz-next.wav";
                $scope.soundObject = new Audio();
                $scope.soundObject.src = audioUrl;
             }

             else if ($scope.message === 'quiz-prev')
             {
                audioUrl= API_URL+"assets/audio/quiz-prev.wav";
                $scope.soundObject = new Audio();
                $scope.soundObject.src = audioUrl;
             }

             else if ($scope.message === 'quiz-timeout')
             {
                audioUrl= API_URL+"/assets/audio/quiz-timeout.wav";
                $scope.soundObject = new Audio();
                $scope.soundObject.src = audioUrl;
             }

             else if ($scope.message === 'quiz-end')
             {
                audioUrl= API_URL+"assets/audio/quiz-end.wav";
                $scope.soundObject = new Audio();
                $scope.soundObject.src = audioUrl;
             }


             console.log($scope.message);


             $scope.soundObject.play().then(function(res){
                    

                    console.log($scope.soundObject);

                    $scope.isPlaying = true;


             });


             $scope.soundObject.addEventListener('ended', (event) => {

                    $scope.isPlaying = false;
                        
            });







        });



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
        };



        vm.decodeUrlToken = function(urlToken)
        {

            var decodedUri = decodeURIComponent(urlToken);
            var decodedObject = atob(decodedUri);
            return JSON.parse(decodedObject);

        };




            /*
            setTimeout(function() {

                document.addEventListener('contextmenu', event => event.preventDefault());

            })
            */



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
                'next' : ['Next', 'تالي'],
                'previous' : ['Previous', 'السابق'],


                'back': ['Back', 'الى الخلف'],

                'profile': ['Profile', 'الملف الشخصي'],
                'setting': ['Setting', 'ضبط'],
                'logout': ['Logout', 'الخروج']

        };


        vm.updateDashboardLogo = function()
        {

            var successLogoFetch = function(res)
            {

                 var fetchedLogo = res.data.logo;

                 if(res.data.logo == undefined && res.data.logo == null)
                 {
                     $scope.entityLogo = 'assets/images/demo-logo.jpg';    
                 }

                 else {

                    $scope.entityLogo = API_URL+fetchedLogo;

                 }

                 

                 

            };        

            var errorLogoFetch = function(res)
            {


                $scope.entityLogo = 'assets/images/demo-logo.jpg';

            };

            
            if(auth.isLoggedIn())
            {
           
                var roleName = auth.getUser().role;

                if(roleName == 'entity')
                {

                    // get self profile logo
                    $http.get(API_URL+'profile-authlogo').then(successLogoFetch, errorLogoFetch);
                    
                }

            }


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



        vm.generatePassword  = function() {

        var length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
                for (var i = 0, n = charset.length; i < length; ++i) {
                    retVal += charset.charAt(Math.floor(Math.random() * n));
                }
                return retVal;
        };




    }]);


})();