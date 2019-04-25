(function(){

    angular.module('io2v3')


    .config(stateConfig);

    function stateConfig($stateProvider, $urlRouterProvider, $locationProvider){

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: true  
         });

        $urlRouterProvider.otherwise('notfound');

        $stateProvider

        .state('pub', {
            templateUrl: 'views/templates/publicTemplate.html',
            abstract: true
        })



        .state('pub.home', {

            url: '/',
            templateUrl: 'views/home.html',
            controller : 'homeCtrl'
        })

        .state('pub.about', {

            url: '/about',
            templateUrl: 'views/about.html'
        })

        .state('pub.tos', {

            url: '/term-service',
            templateUrl: 'views/terms-service.html'
        })

        .state('pub.pp', {

            url: '/privacy-policy',
            templateUrl: 'views/privacy-policy.html'
            
        })

        .state('exm', {
            abstract: true,
            templateUrl : 'views/templates/examTemplate.html',
            controller : 'examMgmtAbstractCtrl as exAbs'
            
        })

        .state('exm.exam', {
            url : '/exam-overview/:examID',
            templateUrl : 'views/exams/exam-overview.html',
            controller : 'examOverviewCtrl as vm'
        })
      

        .state('exm.quizQuestions', {
            url : '/quiz-questions/:examID',
            templateUrl : 'views/exams/quiz-questions.html',
            controller : 'quizQuestionsCtrl as vm'
        })

        .state('exm.addQuizQuestions', {
            url : '/add-quiz-questions/:examID',
            templateUrl: 'views/dash/que-add.html',
            controller : 'queAddCtrl as vm'
        })


        .state('exm.quizOverview', {

            url : '/exam-quiz-overview',
            templateUrl : 'views/exams/quiz-attempt-overview.html'
            
        })

        .state('exm.edit', {

            url : '/exam-edit',
            templateUrl : 'views/exams/exam-edit.html',
            
        })


        .state('exm.enroll', {

            url : '/exam-enroll/:examID',
            templateUrl : 'views/exams/exam-enroll.html',
            controller : 'enrollCtrl as vm'
            
        })

        .state('exm.register', {

            url : '/exam-register/:examID',
            templateUrl : 'views/exams/exam-register.html',
            controller : 'registerEnrollCtrl as vm'
            
        })


        .state('exm.editQuiz', {

            url : '/quiz-edit',
            templateUrl : 'views/exams/quiz-edit.html',
  
        })

        .state('exm.progress', {

            url : '/exam-progress/:examID',
            templateUrl : 'views/exams/exam-progress.html',
            controller : 'quizProgressCtrl as vm'
            
        })

        .state('exm.prog-detail', {

            url : '/exam-progress-detail',
            templateUrl : 'views/exams/exam-progress-detail.html',
            
        })

        .state('exm.answer', {
            url : '/exams/answer/:examID/:attemptID',
            templateUrl : 'views/exams/answer-sheet.html',
            controller : 'quizAnswerInpectCtrl as vm'
        })

        .state('exm.consent', {
            url : '/exams/consent/:examID/:attemptID',
            templateUrl : 'views/exams/consent.html',
            controller : 'quizAnswerConsentCtrl as vm'           
        })

        .state('exm.scorecard', {
            url : '/exams/scorecard/:examID/:attemptID',
            templateUrl : 'views/exams/scorecard.html',
            controller : 'quizScoreCardCtrl as vm'           
        })




        .state('exm.check', {

            url : '/exam-checkscroll',
            templateUrl : 'views/check-scroll.html',
            
        })

        

        .state('exm.quizWeightDistro', {

            url : '/quiz-weight-distro/:examID',
            templateUrl : 'views/exams/quiz-weight-distro.html',
            controller : 'quizWeightDistroCtrl as vm'
            
        })



        .state('exm.quizEvaluate', {

            url : '/quiz-evaluate',
            templateUrl : 'views/exams/quiz-evaluate.html'
            
        })

        .state('exm.notify', {

            url : '/notify',
            templateUrl : 'views/notify.html',
            controller: 'notifyCtrl as vm'
            
        })


        .state('dash', {
            templateUrl : 'views/templates/dashboardTemplate.html',
            abstract: true
        })


        

        .state('dash.land', {
            url : '/dashboard',
            templateUrl: 'views/dash-landing.html',
            controller : 'dashLandCtrl as vm',
            authenticate: true,
            roles : ['admin', 'entity', 'contributor']
        })

        .state('dash.addQuiz', {

            url : '/quiz-add',
            templateUrl : 'views/dash/quiz-add.html',
            controller : 'addquizCtrl as vm'
  
        })

        .state('dash.cats', {
            url : '/categories',
            templateUrl: 'views/dash/categories.html',
            controller : 'categoriesCtrl as vm'
        })

        .state('dash.catree', {
            url : '/cat-tree',
            templateUrl: 'views/dash/cat-tree.html',
            controller : 'catTreeCtrl as vm'
        })

        .state('dash.newExam', {
            url : '/new-exam',
            templateUrl: 'views/dash/exam-add.html'
        })


        .state('dash.quePool', {
            url : '/que-pool',
            templateUrl: 'views/dash/que-pool.html',
            controller : 'quepoolCtrl as vm'
        })

        .state('dash.queadd', {
            url : '/que-add',
            templateUrl: 'views/dash/que-add.html',
            controller : 'queAddCtrl as vm'
        })


        .state('dash.users', {
            url : '/users',
            templateUrl: 'views/dash/users.html',
            controller : 'usersCtrl as vm'
        })


        .state('dash.roles', {

            url : '/roles',
            templateUrl : 'views/dash/roles.html',
            controller : 'rolesCtrl as vm'

        })

        .state('dash.permission', {
            url : '/permissions',
            templateUrl : 'views/dash/permissions.html',
            controller : 'permissionsCtrl as vm'
        })

        .state('dash.rolePermissions', {
            url : '/role-permissions',
            templateUrl : 'views/dash/role-permissions.html',
            controller : 'rolePermissionsCtrl as vm'
        })


        

        .state('dash.library', {

            url : '/library',
            templateUrl : 'views/dash/library.html',
            controller : 'libraryCtrl as vm'

        })

        .state('dash.modal', {
            url : '/modal',
            templateUrl : 'views/modal.html',
            controller : 'modalCtrl as vm'
        })


        .state('ua', {
            abstract: true,
            template: '<ui-view/>'
        })


        .state('ua.login', {
            url : '/login',
            templateUrl: 'views/login.html',
            controller: 'loginCtrl as vm'
        })

        .state('ua.register', {
            url : '/register',
            templateUrl: 'views/register.html',
            controller : 'registerCtrl as vm'
        })

        .state('ua.forget', {
            url : '/forget',
            templateUrl: 'views/forget.html'
        })

        .state('logout', {
            url : '/logout',
            controller: 'logoutCtrl as vm'
        })


        .state('core', {

            url: '/core',
            templateUrl: 'views/core.html',
            controller : 'coreCtrl as vm',
            authenticate : true,       
            roles : ['admin', 'entity', 'contributor']

        })

       
        .state('smauth', {
            url : '/allauth',
            templateUrl : 'views/everyauth.html',
            authenticate: true,
        })

        .state('fbi', {
            url : '/fbi',
            templateUrl : 'views/dash-fbi.html',
            authenticate: true,
            roles : ['admin']
        })

        .state('std', {
            templateUrl: 'views/templates/studentTemplate.html',
            controller : 'stdCtrl as std',
            abstract: true
        })


        .state('std.exams', {
            url : '/stexams',
            templateUrl : 'views/student/exams.html',
            controller: 'stdExamCtrl as vm'

        })

        .state('std.quiz', {
            url : '/quiz',
            controller : 'stdQuizCtrl as vm',
            templateUrl : 'views/student/quiz.html'

        })


        .state('quizPlay',{

            url : '/quiz-assement/:attempt_id/:quiz_id',
            templateUrl : 'views/student/quiz-play.html',
            controller : 'quizAttemptCtrl as vm',
            resolve : {

                quizPlayData : function(quizPlay, $stateParams)
                {
                   
                    var attempt_id = $stateParams.attempt_id;
                    var quiz_id = $stateParams.quiz_id;
                    return quizPlay.prepQuizQuestion(quiz_id, quiz_id);

                }

            },
            authenticate : true,
            roles : ['student']
        })

        
        .state('notfound', {
            url: '/notfound',
            templateUrl: 'views/404.html'
        });

 };

 })();



