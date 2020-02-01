(function(){
	angular.module('io2v3')
	.controller('baseCtrl', ['$scope', 'auth', 'langSer', 'API_URL', '$state', '$http', function($scope, auth, langSer, API_URL, $state, $http){

		var vm = this;

        


        vm.branding = "IO2 Version 3";

		$scope.baseUrl = API_URL;


        $scope.langDropOPen = false;


        $scope.masterData = null;

		

        $scope.lang = langSer.init();


        $scope.soundObject = null;


        $scope.isPlaying = false;


        $scope.entityLogo = 'assets/images/demo-logo.jpg';






        $scope.switchLang = function()
        {

            $scope.lang = langSer.switchLang();

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


        $scope.langIndex = function()
        {
            return langSer.langIndex();

        };


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

                    /*
          
                var preLoadAudioObject = new Audio();

                preLoadAudioObject.src =  soundLinkUrl;

                preLoadAudioObject.volume = 0;

                preLoadAudioObject.play();                                

                */

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

                "exams": ['Exams', 'الامتحانات' , 'Examens'],
                "about" : ['About', 'حول' , 'Sur'],
                "terms" : ['Terms', 'شروط' , 'termes'],
                "privacy" : ['Privacy Policy', 'سياسة خاصة' , 'Intimité'],
                

                'details': ['Details', 'تفاصيل', 'Détails' ],



                'status': ['Status', 'الحالة' , 'Statut'],
                'available' : ['Available', 'متوفر', 'Disponible'],

                'options': ['Actions', 'خيارات' , 'les options'],
                'details': ['Details', 'تفاصيل', 'détails' ],
                

                'addnew': ['Add New', 'اضف جديد', 'addnew'],
                'update': ['Update', 'تحديث' , 'Mise à jour'],
                'save': ['Save', 'حفظ' , 'Enregistrer'],
                'cancel': ['Cancel', 'حذف' , 'Annuler'] ,
                'edit': ['Edit', 'تصحيح', 'Éditer'],
                'remove': ['Remove', 'حذف' , 'retirer'],
                'delete' : ['Delete', 'حذف', 'Supprimer'],
                'next' : ['Next', 'تالي' , 'suivant'] ,
                'previous' : ['Previous', 'السابق' , 'précédent'],


                'back': ['Back', 'الى الخلف' , 'retour'],

                'profile': ['Profile', 'الملف الشخصي' , 'profil'],
                'setting': ['Setting', 'ضبط' , 'réglage'],
                'logout': ['Logout', 'الخروج', 'Se déconnecter'],
                'login' : ['Login', 'تسجيل الدخول', "s'identifier"],
                'register' : ['Register', 'تسجيل', "S'inscrire"],


                'hello' : ['hello', 'مرحبا', 'Bonjour'],

                'dashboard':['Dashboard', 'لوحة القيادة', 'Tableau de bord'],

                'questions':['Questions', 'الأسئلة', 'Des questions'],

                'quizes' : ['Quizzes', 'الإختبارات', 'Quiz'],

                'quiz' : ['Quiz', 'اختبار', 'Quiz'],
                'stats': ['Stats', 'احصائيات', 'Statistiques'],
                'roles' : ['Roles', 'الأدوار', 'rôles'],
                'users': ['Users', 'المستخدمين', 'Utilisateurs'],
                'user' : ['User', 'المستعمل', 'Utilisateur'],

                'myusers': ['My Users', 'بلدي المستخدمين', 'Mes-utilisateurs'],


                'permissions': ['Permissions', 'أذونات', 'Autorisations'],
                'rolepermissions': ['Role Permissions', 'أذونات الدور', 'Autorisations de rôle'],
                'categories' : ['Categories', 'التصنيفات', 'catégories'],
                'medialibraray': ['Media Libraray', 'مكتبة الوسائط', 'Médiathèque'],
                'modaltest': ['Modal Test', 'اختبار مشروط', 'Test modal'],
                'activity' : ['Activity', 'نشاط', 'activité'],
                'groups' : ['Groups', 'مجموعات', 'groupes'],

                'overview': ['Overview', 'نظرة عامة', 'Aperçu'],
                'progress' : ['Progress', 'تقدم', 'Le progrès'],
                'weightDistribution' : ['Weight Distribution', 'توزيع الوزن', 'La répartition du poids'],
                'enroll' : ['Enroll', 'يتسجل، يلتحق', 'Inscrire'],

                'modifyDateTime' : ['Modify Date/Time', 'تعديل وقت', 'Modifier datetime'],

                'title' : ['Title', 'عنوان', 'Titre'],
                'sno': ["S.NO", "فهرس", "Indice"],
                'min' : ['Min.', 'الحد الأدنى' , 'le minimum'],
                'max' : ['Max.', 'أقصى', 'Le Maximum'],

                'duration' : ['Duration', 'المدة الزمنية', 'Durée'],

                'filter' : ['Filter', 'منقي', 'Filtre'],
                'filterTitle': ['Fitler by title', 'تصفية حسب العنوان', 'Filtrer par titre'],

                'email': ['Email', 'البريد الإلكتروني', 'Email'],
                'name' : ['Name', 'اسم', 'Nom'],

                'changePassword': ['Change Password', 'تغيير كلمة السر', 'changer le mot de passe'],
                'sendRegistrationEmail' : ['Send Registration Email', 'إرسال تسجيل البريد الإلكتروني', "Envoyer un e-mail d'inscription"],

                'upload': ['Upload', 'رفع', 'Télécharger'],

                'autoGenerate' : ['Auto Generate', 'توليد السيارات', "Génération automatique"],

                'loading' : ['loading data please wait...', 'تحميل البيانات يرجى الانتظار', "Chargement des données veuillez patienter"],
                'norecords' : ['No records were found', 'لم يتم العثور على سجلات', "Aucun enregistrement n'a été trouvé"]






        };


        console.log('updated with lang drop');

        $scope.langDropToggle = function()
        {

            $scope.langDropOPen = !$scope.langDropOPen;
            

        };


        $scope.changeLanguage = function(prefix)
        {
            $scope.lang = langSer.changeLanguage(prefix);

            $scope.langDropToggle();

            
        }


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



		


        vm.getIndex = function(array, attr, value) {
            for(var i = 0; i < array.length; i += 1) {
                if(array[i][attr] === value) {
                    return i;
                }
            }
            return -1;
        };

		
        

        $scope.authUser = vm.authUser();


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